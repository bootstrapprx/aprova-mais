use std::time::Instant;
use reqwest::Client;
use tokio::sync::RwLock;

use crate::types::{HttpHealth, AppData};

pub async fn collect_http_health(client: &Client, data: &RwLock<AppData>) {
    let endpoints = vec![
        ("App", "http://localhost:82/"),
        ("Admin", "http://localhost:82/admin"),
        ("Auth", "http://auth:9999/"),
    ];

    let mut results = Vec::new();
    for (name, url) in &endpoints {
        let start = Instant::now();
        let resp = client.get(*url).timeout(std::time::Duration::from_secs(5)).send().await;
        let elapsed = start.elapsed().as_millis() as u64;
        match resp {
            Ok(r) => {
                let status = r.status().as_u16();
                results.push(HttpHealth {
                    endpoint: name.to_string(),
                    status,
                    latency_ms: elapsed,
                    ok: status < 500,
                });
            }
            Err(_) => {
                results.push(HttpHealth {
                    endpoint: name.to_string(),
                    status: 0,
                    latency_ms: elapsed,
                    ok: false,
                });
            }
        }
    }

    let mut data = data.write().await;
    data.http_health = results;
}
