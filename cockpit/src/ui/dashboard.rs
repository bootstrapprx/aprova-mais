use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Gauge, Paragraph, Wrap},
    Frame,
};

use crate::types::AppData;

pub fn render(frame: &mut Frame, area: Rect, data: &AppData) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Length(8),
            Constraint::Length(8),
            Constraint::Min(5),
        ])
        .split(area);

    render_metrics_row(frame, chunks[0], data);
    render_health_row(frame, chunks[1], data);
    render_recent_errors(frame, chunks[2], data);
}

fn render_metrics_row(frame: &mut Frame, area: Rect, data: &AppData) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Ratio(1, 3); 3])
        .split(area);

    if let Some(sys) = &data.system {
        render_card(frame, chunks[0], "CPU", &format!("{:.1}%", sys.cpu_percent));
        render_gauge(frame, chunks[0], sys.cpu_percent / 100.0, Color::Cyan);

        let mem_pct = if sys.mem_total > 0 { sys.mem_used as f64 / sys.mem_total as f64 } else { 0.0 };
        render_card(frame, chunks[1], "RAM", &format!("{:.1}/{:.1}G", sys.mem_used as f64 / 1e9, sys.mem_total as f64 / 1e9));
        render_gauge(frame, chunks[1], mem_pct, Color::Green);

        let disk_pct = if sys.disk_total > 0 { sys.disk_used as f64 / sys.disk_total as f64 } else { 0.0 };
        render_card(frame, chunks[2], "Disk", &format!("{:.1}/{:.1}G", sys.disk_used as f64 / 1e9, sys.disk_total as f64 / 1e9));
        render_gauge(frame, chunks[2], disk_pct, Color::Yellow);
    }
}

fn render_health_row(frame: &mut Frame, area: Rect, data: &AppData) {
    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([Constraint::Ratio(1, 3); 3])
        .split(area);

    let n_running = data.containers.iter().filter(|c| c.state == "running").count();
    let n_total = data.containers.len();
    render_card(frame, chunks[0], "Containers", &format!("{}/{} running", n_running, n_total));

    let all_healthy = data.http_health.iter().all(|h| h.ok);
    let api_status = if all_healthy { "All OK" } else { "Degraded" };
    render_card(frame, chunks[1], "API Health", api_status);

    let git_info = match &data.git {
        Some(g) => format!("{} @{}", g.branch, g.commit_short),
        None => "N/A".into(),
    };
    render_card(frame, chunks[2], "Git", &git_info);
}

fn render_recent_errors(frame: &mut Frame, area: Rect, data: &AppData) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Recent Errors / Events ")
        .title_style(Style::new().fg(Color::Red).add_modifier(Modifier::BOLD))
        .style(Style::new().fg(Color::White));

    let inner = block.inner(area);

    let errors: Vec<_> = data.logs.iter()
        .filter(|l| l.level == "error" || l.level == "warn")
        .take(8)
        .collect();

    let text: Vec<Line> = if errors.is_empty() {
        vec![Line::from(vec![Span::styled(" ✓ No recent errors", Style::new().fg(Color::Green))])]
    } else {
        errors.iter().map(|e| {
            let ts = e.timestamp.format("%H:%M:%S");
            let color = match e.level.as_str() {
                "error" => Color::Red,
                "warn" => Color::Yellow,
                _ => Color::White,
            };
            Line::from(vec![
                Span::styled(format!(" {} ", ts), Style::new().fg(Color::DarkGray)),
                Span::styled(format!("[{}]", e.source), Style::new().fg(Color::Cyan)),
                Span::raw(" "),
                Span::styled(&e.message, Style::new().fg(color)),
            ])
        }).collect()
    };

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(text).wrap(Wrap { trim: false }), inner);
}

fn render_card(frame: &mut Frame, area: Rect, title: &str, value: &str) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(format!(" {} ", title))
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    let text = Text::from(Line::from(vec![
        Span::styled(value.to_string(), Style::new().fg(Color::White).add_modifier(Modifier::BOLD)),
    ]));
    frame.render_widget(Paragraph::new(text), inner);

}

fn render_gauge(frame: &mut Frame, area: Rect, pct: f64, color: Color) {
    let block = Block::default();
    let inner = block.inner(area);
    let gauge_area = Rect { x: inner.x + 1, y: inner.y + 2, width: inner.width.saturating_sub(2), height: 1 };
    if gauge_area.width > 2 {
        let gauge = Gauge::default()
            .block(Block::default())
            .gauge_style(Style::new().fg(color).bg(Color::DarkGray))
            .ratio(pct as f64);
        frame.render_widget(gauge, gauge_area);
    }
}
