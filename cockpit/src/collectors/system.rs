use std::time::Duration;
use sysinfo::{System, Disks, Networks, SystemExt, DiskExt};
use tokio::sync::RwLock;

use crate::types::{SystemInfo, AppData};

pub fn collect_system(sys: &mut System, data: &RwLock<AppData>) {
    sys.refresh_all();

    let hostname = System::host_name().unwrap_or_default();
    let os = System::long_os_version().unwrap_or_default();
    let cpu_percent = sys.global_cpu_info().cpu_usage() as f64;
    let cpu_cores = sys.physical_core_count().unwrap_or(0);
    let mem_total = sys.total_memory();
    let mem_used = sys.used_memory();

    let disks = Disks::new_with_refreshed_list();
    let (disk_used, disk_total) = disks.iter().fold((0u64, 0u64), |(used, total), d| {
        (used + d.total() - d.available(), total + d.total())
    });

    let load = System::load_average();
    let uptime_secs = System::uptime();
    let uptime = if uptime_secs < 60 { format!("{}s", uptime_secs) }
        else if uptime_secs < 3600 { format!("{}m {}s", uptime_secs / 60, uptime_secs % 60) }
        else if uptime_secs < 86400 { format!("{}h {}m", uptime_secs / 3600, (uptime_secs % 3600) / 60) }
        else { format!("{}d {}h", uptime_secs / 86400, (uptime_secs % 86400) / 3600) };

    let info = SystemInfo {
        hostname,
        os,
        cpu_percent,
        cpu_cores,
        mem_used,
        mem_total,
        disk_used,
        disk_total,
        load_avg: (load.one, load.five, load.fifteen),
        uptime,
    };

    let rt = tokio::runtime::Handle::try_current();
    if let Ok(rt) = rt {
        rt.block_on(async {
            let mut data = data.write().await;
            data.system = Some(info);
        });
    }
}
