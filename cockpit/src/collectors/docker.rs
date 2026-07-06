use std::time::Duration;
use bollard::{Docker, container::ListContainersOptions, container::StatsOptions};
use bollard::container::InspectContainerOptions;
use chrono::Utc;
use futures_util::StreamExt;
use tokio::sync::RwLock;

use crate::types::{ContainerInfo, LogEntry, AppData};

pub async fn collect_containers(docker: &Docker, data: &RwLock<AppData>) {
    let options = ListContainersOptions::<String> { all: true, ..Default::default() };
    let containers = match docker.list_containers(Some(options)).await {
        Ok(c) => c,
        Err(_) => return,
    };

    let mut infos = Vec::new();
    for container in &containers {
        let id = container.id.as_deref().unwrap_or("").to_string();
        let names = container.names.as_ref().map(|n| {
            n.iter().map(|s| s.trim_start_matches('/').to_string()).collect::<Vec<_>>().join(", ")
        }).unwrap_or_default();
        let image = container.image.as_deref().unwrap_or("").to_string();
        let state = container.state.as_deref().unwrap_or("").to_string();
        let status = container.status.as_deref().unwrap_or("").to_string();
        let ports = container.ports.as_ref().map(|p| {
            p.iter().map(|pp| {
                if let (Some(pub_p), Some(priv_p)) = (pp.public_port, Some(pp.private_port)) {
                    format!("{}:{}->{}/{}", pp.ip.as_deref().unwrap_or("0.0.0.0"), pub_p, priv_p, pp.type_)
                } else {
                    format!("{}/{}", pp.private_port, pp.type_)
                }
            }).collect::<Vec<_>>().join(", ")
        }).unwrap_or_default();

        let health = match docker.inspect_container(&id, Some(InspectContainerOptions::default())).await {
            Ok(info) => info.state.and_then(|s| s.health).and_then(|h| h.status).unwrap_or_default(),
            Err(_) => String::new(),
        };

        infos.push(ContainerInfo {
            id: id.chars().take(12).collect(),
            name: names,
            image,
            status,
            state,
            ports,
            cpu_percent: 0.0,
            mem_bytes: 0,
            mem_limit: 0,
            uptime: String::new(),
            health,
        });
    }

    let mut data = data.write().await;
    data.containers = infos;
}

pub async fn collect_container_stats(docker: &Docker, container_id: &str) -> Option<(f64, u64, u64)> {
    let options = StatsOptions { stream: false, ..Default::default() };
    let mut stream = docker.stats(container_id, Some(options));
    while let Some(item) = stream.next().await {
        match item {
            Ok(stats) => {
                let cpu_delta = stats.cpu_stats.cpu_usage.total_usage
                    .saturating_sub(stats.precpu_stats.cpu_usage.total_usage);
                let system_delta = stats.cpu_stats.system_cpu_usage
                    .zip(stats.precpu_stats.system_cpu_usage)
                    .map(|(cur, prev)| cur.saturating_sub(prev))
                    .unwrap_or(1);
                let num_cpus = stats.cpu_stats.online_cpus.unwrap_or(1) as f64;
                let cpu_percent = if system_delta > 0 && cpu_delta > 0 {
                    (cpu_delta as f64 / system_delta as f64) * num_cpus * 100.0
                } else { 0.0 };

                let mem_usage = stats.memory_stats.usage.unwrap_or(0);
                let mem_limit = stats.memory_stats.limit.unwrap_or(0);
                return Some((cpu_percent.min(100.0), mem_usage, mem_limit));
            }
            Err(_) => return None,
        }
    }
    None
}

pub fn elapsed_to_string(d: Duration) -> String {
    let secs = d.as_secs();
    if secs < 60 { format!("{}s", secs) }
    else if secs < 3600 { format!("{}m {}s", secs / 60, secs % 60) }
    else if secs < 86400 { format!("{}h {}m", secs / 3600, (secs % 3600) / 60) }
    else { format!("{}d {}h", secs / 86400, (secs % 86400) / 3600) }
}
