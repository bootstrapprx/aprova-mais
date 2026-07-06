use std::time::Duration;
use std::sync::Arc;

use crossterm::event::{self, Event, KeyCode, KeyEventKind};
use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Style},
    widgets::{Block, Borders, Clear, Paragraph},
    Frame,
};
use tokio::sync::RwLock;

use crate::collectors;
use crate::components;
use crate::config::Args;
use crate::types::{AppData, Tab, UiState};
use crate::ui;

const TICK_RATE: Duration = Duration::from_millis(250);

pub async fn run(args: Args) -> color_eyre::Result<()> {
    color_eyre::install()?;
    let mut terminal = ratatui::init();

    let data: Arc<RwLock<AppData>> = Arc::new(RwLock::new(AppData::default()));
    let ui_state: Arc<RwLock<UiState>> = Arc::new(RwLock::new(UiState::default()));

    let docker = bollard::Docker::connect_with_local_defaults().ok();
    let http_client = reqwest::Client::builder()
        .timeout(Duration::from_secs(5))
        .build()?;
    let mut sys = sysinfo::System::new_all();

    let project_dir = args.project_dir.clone();
    let data_clone = data.clone();

    tokio::spawn(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(args.poll_interval_secs)).await;

            if let Some(ref docker) = docker {
                collectors::docker::collect_containers(docker, &data_clone).await;
            }

            collectors::http_health::collect_http_health(&http_client, &data_clone).await;
            collectors::git::collect_git(&project_dir, &data_clone).await;

            {
                let mut d = data_clone.write().await;
                d.last_update = Some(chrono::Utc::now());
            }
        }
    });

    let system_data = data.clone();
    let _system_handle = std::thread::spawn(move || {
        loop {
            std::thread::sleep(Duration::from_secs(5));
            collectors::system::collect_system(&mut sys, &system_data);
        }
    });

    loop {
        terminal.draw(|frame| {
            render_app(frame, &data, &ui_state);
        })?;

        if event::poll(TICK_RATE).ok() == Some(true) {
            if let Event::Key(key) = event::read()? {
                if key.kind == KeyEventKind::Press {
                    let mut ui = ui_state.blocking_write();
                    match key.code {
                        KeyCode::Char('q') => break,
                        KeyCode::Char('h') => ui.show_help = !ui.show_help,
                        KeyCode::Tab | KeyCode::Right => ui.tab = ui.tab.next(),
                        KeyCode::BackTab | KeyCode::Left => ui.tab = ui.tab.prev(),
                        KeyCode::Down => {
                            if ui.tab == Tab::Containers {
                                ui.selected_container = Some(
                                    ui.selected_container.unwrap_or(0).saturating_add(1)
                                );
                            }
                        }
                        KeyCode::Up => {
                            if ui.tab == Tab::Containers {
                                ui.selected_container = Some(
                                    ui.selected_container.unwrap_or(0).saturating_sub(1)
                                );
                            }
                        }
                        KeyCode::Char('d') if ui.tab == Tab::Deploy => {
                            let d = data.clone();
                            let p = project_dir.clone();
                            tokio::spawn(async move {
                                crate::actions::deploy::start_deploy(d, &p).await;
                            });
                        }
                        KeyCode::Char('r') => {
                            drop(ui);
                            let d = data.clone();
                            let http = http_client.clone();
                            let proj = project_dir.clone();
                            tokio::spawn(async move {
                                if let Some(ref docker) = docker {
                                    collectors::docker::collect_containers(docker, &d).await;
                                }
                                collectors::http_health::collect_http_health(&http, &d).await;
                                collectors::git::collect_git(&proj, &d).await;
                            });
                        }
                        _ => {}
                    }
                }
            }
        }
    }

    ratatui::restore();
    Ok(())
}

fn render_app(frame: &mut Frame, data: &Arc<RwLock<AppData>>, ui: &Arc<RwLock<UiState>>) {
    let data = data.blocking_read();
    let ui = ui.blocking_read();

    let area = frame.area();
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(1),
            Constraint::Length(1),
            Constraint::Min(1),
            Constraint::Length(1),
        ])
        .split(area);

    components::header::render(frame, chunks[0], &data);
    components::tabs::render(frame, chunks[1], &ui.tab);
    ui::render_content(frame, chunks[2], &data, &ui);
    components::status_bar::render(frame, chunks[3], &ui.tab);

    if ui.show_help {
        render_help(frame, area);
    }
}

fn render_help(frame: &mut Frame, area: Rect) {
    let block = Block::default()
        .borders(Borders::ALL)
        .style(Style::new().bg(Color::Black).fg(Color::White))
        .title(" Help ")
        .title_style(Style::new().fg(Color::Cyan));

    let help_text = vec![
        " Tab/→     Next tab",
        " Shift+Tab/←  Previous tab",
        " ↑/↓       Scroll / select",
        " r         Refresh data",
        " d         Start deploy (in Deploy tab)",
        " h         Toggle help",
        " q         Quit",
        "",
        " Tabs:",
        "  Dashboard   - Overview of system health",
        "  Containers  - Docker container status & details",
        "  Database    - DB stats, tables, active queries",
        "  Deploy      - Assisted deployment wizard",
        "  Logs        - Log viewer with filtering",
        "  Security    - Security analysis",
    ];

    let area = centered_rect(50, 20, area);
    frame.render_widget(Clear, area);
    frame.render_widget(block, area);
}

fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length((r.height * (100 - percent_y)) / 200),
            Constraint::Min(1),
            Constraint::Length((r.height * (100 - percent_y)) / 200),
        ])
        .split(r);

    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Length((r.width * (100 - percent_x)) / 200),
            Constraint::Min(1),
            Constraint::Length((r.width * (100 - percent_x)) / 200),
        ])
        .split(popup_layout[1])[1]
}
