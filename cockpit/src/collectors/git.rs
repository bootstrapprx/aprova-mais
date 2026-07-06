use chrono::{TimeZone, Utc};
use git2::Repository;
use tokio::sync::RwLock;

use crate::types::{GitInfo, AppData};

pub async fn collect_git(project_dir: &str, data: &RwLock<AppData>) {
    let repo = match Repository::open(project_dir) {
        Ok(r) => r,
        Err(_) => return,
    };

    let head = match repo.head() {
        Ok(h) => h,
        Err(_) => return,
    };

    let branch = head.shorthand().unwrap_or("unknown").to_string();
    let commit = match head.peel_to_commit() {
        Ok(c) => c,
        Err(_) => return,
    };

    let commit_short = commit.id().to_string().chars().take(7).collect();
    let commit_message = commit.summary().unwrap_or("").to_string();
    let commit_time = commit.time();
    let last_commit_date = Utc.timestamp_opt(commit_time.seconds(), 0).single();

    let statuses = match repo.statuses(None) {
        Ok(s) => s,
        Err(_) => return,
    };
    let dirty = !statuses.is_empty();

    let info = GitInfo {
        branch,
        commit_short,
        commit_message,
        dirty,
        ahead: 0,
        behind: 0,
        last_commit_date,
    };

    let mut data = data.write().await;
    data.git = Some(info);
}
