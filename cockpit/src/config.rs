use clap::Parser;

#[derive(Parser, Debug, Clone)]
#[command(name = "aprova-cockpit", about = "Operational TUI cockpit for Aprova+")]
pub struct Args {
    #[arg(long, default_value = "/mnt/toshiba/git/aprova-mais")]
    pub project_dir: String,

    #[arg(long, default_value = "aprova-mais")]
    pub compose_project: String,

    #[arg(long)]
    pub db_url: Option<String>,

    #[arg(long, default_value = "3000")]
    pub refresh_ms: u64,

    #[arg(long, default_value = "60")]
    pub poll_interval_secs: u64,
}

impl Default for Args {
    fn default() -> Self {
        Self {
            project_dir: "/mnt/toshiba/git/aprova-mais".into(),
            compose_project: "aprova-mais".into(),
            db_url: None,
            refresh_ms: 3000,
            poll_interval_secs: 60,
        }
    }
}
