use std::sync::Arc;
use tokio::sync::RwLock;
use crate::types::{AppData, DeployStatus, StepStatus};

pub async fn start_deploy(data: Arc<RwLock<AppData>>, project_dir: &str) {
    let mut status = {
        let d = data.read().await;
        d.deploy_status.clone()
    };

    if status.running {
        return;
    }

    status.running = true;
    status.current_step = 0;
    for step in &mut status.steps {
        step.status = StepStatus::Pending;
        step.output.clear();
    }
    status.log.clear();

    {
        let mut d = data.write().await;
        d.deploy_status = status.clone();
    }

    let deploy_steps: Vec<(&str, &[&str])> = vec![
        ("Git pull", &["pull"] as &[&str]),
        ("Build image", &["compose", "-f", "docker-compose.prod.yml", "build", "app"]),
        ("Schema push", &["compose", "-f", "docker-compose.prod.yml", "exec", "app", "npx", "drizzle-kit", "push"]),
        ("Seed data", &["compose", "-f", "docker-compose.prod.yml", "exec", "app", "npx", "tsx", "./scripts/prod.ts"]),
        ("Restart services", &["compose", "-f", "docker-compose.prod.yml", "restart"]),
    ];

    for (i, (name, args)) in deploy_steps.iter().enumerate() {
        {
            let mut d = data.write().await;
            d.deploy_status.current_step = i;
            d.deploy_status.steps[i].status = StepStatus::Running;
        }

        let mut full_args = vec!["-C", project_dir];
        full_args.extend_from_slice(args);

        let result = crate::actions::run_command("git", full_args.as_slice(), project_dir).await;

        let (status_msg, success) = match &result {
            Ok(out) => (out.clone(), true),
            Err(e) => (e.clone(), false),
        };

        {
            let mut d = data.write().await;
            if success {
                d.deploy_status.steps[i].status = StepStatus::Success;
            } else {
                d.deploy_status.steps[i].status = StepStatus::Failed(status_msg.clone());
            }
            d.deploy_status.steps[i].output = status_msg.clone();
            d.deploy_status.log.push_str(&format!("[{}] {}\n", name, status_msg));
        }
    }

    {
        let mut d = data.write().await;
        d.deploy_status.running = false;
    }
}
