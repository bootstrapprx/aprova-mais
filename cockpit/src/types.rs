use std::collections::HashMap;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Default, PartialEq)]
pub enum Tab {
    #[default]
    Dashboard,
    Containers,
    Database,
    Deploy,
    Logs,
    Security,
}

impl Tab {
    pub const ALL: &'static [Tab] = &[
        Tab::Dashboard,
        Tab::Containers,
        Tab::Database,
        Tab::Deploy,
        Tab::Logs,
        Tab::Security,
    ];

    pub fn label(&self) -> &'static str {
        match self {
            Tab::Dashboard => "Dashboard",
            Tab::Containers => "Containers",
            Tab::Database => "Database",
            Tab::Deploy => "Deploy",
            Tab::Logs => "Logs",
            Tab::Security => "Security",
        }
    }

    pub fn prev(&self) -> Self {
        let idx = Self::ALL.iter().position(|t| t == self).unwrap_or(0);
        if idx == 0 { Self::ALL.last().unwrap().clone() } else { Self::ALL[idx - 1].clone() }
    }

    pub fn next(&self) -> Self {
        let idx = Self::ALL.iter().position(|t| t == self).unwrap_or(0);
        if idx >= Self::ALL.len() - 1 { Self::ALL[0].clone() } else { Self::ALL[idx + 1].clone() }
    }
}

#[derive(Debug, Clone)]
pub struct ContainerInfo {
    pub id: String,
    pub name: String,
    pub image: String,
    pub status: String,
    pub state: String,
    pub ports: String,
    pub cpu_percent: f64,
    pub mem_bytes: u64,
    pub mem_limit: u64,
    pub uptime: String,
    pub health: String,
}

#[derive(Debug, Clone)]
pub struct DbInfo {
    pub size_bytes: u64,
    pub connections: u32,
    pub max_connections: u32,
    pub uptime: String,
    pub table_stats: Vec<TableStat>,
    pub active_queries: Vec<ActiveQuery>,
}

#[derive(Debug, Clone)]
pub struct TableStat {
    pub name: String,
    pub row_count: i64,
    pub size_bytes: i64,
}

#[derive(Debug, Clone)]
pub struct ActiveQuery {
    pub pid: i32,
    pub duration: String,
    pub state: String,
    pub query: String,
}

#[derive(Debug, Clone)]
pub struct SystemInfo {
    pub cpu_percent: f64,
    pub cpu_cores: usize,
    pub mem_used: u64,
    pub mem_total: u64,
    pub disk_used: u64,
    pub disk_total: u64,
    pub load_avg: (f64, f64, f64),
    pub uptime: String,
    pub hostname: String,
    pub os: String,
}

#[derive(Debug, Clone)]
pub struct TunnelInfo {
    pub connected: bool,
    pub uptime: String,
    pub last_error: Option<String>,
    pub version: String,
}

#[derive(Debug, Clone)]
pub struct GitInfo {
    pub branch: String,
    pub commit_short: String,
    pub commit_message: String,
    pub dirty: bool,
    pub ahead: usize,
    pub behind: usize,
    pub last_commit_date: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone)]
pub struct HttpHealth {
    pub endpoint: String,
    pub status: u16,
    pub latency_ms: u64,
    pub ok: bool,
}

#[derive(Debug, Clone)]
pub struct LogEntry {
    pub timestamp: DateTime<Utc>,
    pub source: String,
    pub level: String,
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct SecurityAlert {
    pub severity: SecuritySeverity,
    pub category: String,
    pub message: String,
    pub detail: String,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SecuritySeverity {
    Critical,
    Warning,
    Info,
}

#[derive(Debug, Clone, Default)]
pub struct AppData {
    pub containers: Vec<ContainerInfo>,
    pub db: Option<DbInfo>,
    pub system: Option<SystemInfo>,
    pub tunnel: Option<TunnelInfo>,
    pub git: Option<GitInfo>,
    pub http_health: Vec<HttpHealth>,
    pub logs: Vec<LogEntry>,
    pub security_alerts: Vec<SecurityAlert>,
    pub deploy_status: DeployStatus,
    pub last_update: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone)]
pub struct DeployStep {
    pub name: String,
    pub status: StepStatus,
    pub output: String,
    pub started_at: Option<DateTime<Utc>>,
    pub finished_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum StepStatus {
    Pending,
    Running,
    Success,
    Failed(String),
}

#[derive(Debug, Clone)]
pub struct DeployStatus {
    pub running: bool,
    pub current_step: usize,
    pub steps: Vec<DeployStep>,
    pub log: String,
}

impl Default for DeployStatus {
    fn default() -> Self {
        Self {
            running: false,
            current_step: 0,
            steps: vec![
                DeployStep { name: "Git pull".into(), status: StepStatus::Pending, output: String::new(), started_at: None, finished_at: None },
                DeployStep { name: "Build image".into(), status: StepStatus::Pending, output: String::new(), started_at: None, finished_at: None },
                DeployStep { name: "Schema push".into(), status: StepStatus::Pending, output: String::new(), started_at: None, finished_at: None },
                DeployStep { name: "Seed data".into(), status: StepStatus::Pending, output: String::new(), started_at: None, finished_at: None },
                DeployStep { name: "Restart services".into(), status: StepStatus::Pending, output: String::new(), started_at: None, finished_at: None },
            ],
            log: String::new(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct UiState {
    pub tab: Tab,
    pub containers_scroll: usize,
    pub selected_container: Option<usize>,
    pub log_source_filter: String,
    pub log_search: String,
    pub deploy_expanded: bool,
    pub show_help: bool,
}

impl Default for UiState {
    fn default() -> Self {
        Self {
            tab: Tab::Dashboard,
            containers_scroll: 0,
            selected_container: None,
            log_source_filter: "all".into(),
            log_search: String::new(),
            deploy_expanded: false,
            show_help: false,
        }
    }
}
