pub mod deploy;

use std::process::Stdio;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

pub async fn run_command(cmd: &str, args: &[&str], workdir: &str) -> Result<String, String> {
    let output = Command::new(cmd)
        .args(args)
        .current_dir(workdir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .await
        .map_err(|e| format!("Failed to execute {}: {}", cmd, e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    if output.status.success() {
        Ok(stdout)
    } else {
        Err(format!("{}: {}", stderr.trim(), stdout.trim()))
    }
}

pub async fn stream_command(cmd: &str, args: &[&str], workdir: &str) -> Result<(String, String), String> {
    let mut child = Command::new(cmd)
        .args(args)
        .current_dir(workdir)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn {}: {}", cmd, e))?;

    let stdout = child.stdout.take().ok_or("No stdout")?;
    let stderr = child.stderr.take().ok_or("No stderr")?;

    let mut out_lines = Vec::new();
    let mut err_lines = Vec::new();

    let mut out_reader = BufReader::new(stdout).lines();
    let mut err_reader = BufReader::new(stderr).lines();

    let (tx_out, _rx_out) = tokio::sync::mpsc::channel(256);

    tokio::select! {
        _ = async {
            while let Ok(Some(line)) = out_reader.next_line().await {
                out_lines.push(line.clone());
                let _ = tx_out.send(line).await;
            }
        } => {}
        _ = async {
            while let Ok(Some(line)) = err_reader.next_line().await {
                err_lines.push(line);
            }
        } => {}
    }

    let status = child.wait().await.map_err(|e| format!("Wait error: {}", e))?;

    if status.success() {
        Ok((out_lines.join("\n"), err_lines.join("\n")))
    } else {
        Err(format!("Exit code {:?}: {}", status.code(), err_lines.join("\n")))
    }
}
