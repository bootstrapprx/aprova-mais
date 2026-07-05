use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::types::{AppData, SystemInfo};

pub fn render(frame: &mut Frame, area: Rect, data: &AppData) {
    let hostname = data.system.as_ref().map(|s| s.hostname.as_str()).unwrap_or("localhost");
    let uptime = data.system.as_ref().map(|s| s.uptime.as_str()).unwrap_or("--:--");
    let n_containers = data.containers.len();
    let n_running = data.containers.iter().filter(|c| c.state == "running").count();
    let n_errors = data.logs.iter().filter(|l| l.level == "error").count();
    let n_alerts = data.security_alerts.len();

    let chunks = Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Length(40),
            Constraint::Min(10),
            Constraint::Length(30),
        ])
        .split(area);

    let left = Line::from(vec![
        Span::styled(" ◆ ", Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
        Span::styled("aprova-cockpit", Style::new().fg(Color::Green).add_modifier(Modifier::BOLD)),
        Span::raw("  "),
        Span::styled(hostname, Style::new().fg(Color::White)),
        Span::raw(" "),
        Span::styled(uptime, Style::new().fg(Color::DarkGray)),
    ]);

    let center = Line::from(vec![
        Span::styled(format!(" {} running", n_running), Style::new().fg(Color::Green)),
        Span::raw(format!("/{} containers", n_containers)),
    ]);

    let right = if n_errors > 0 || n_alerts > 0 {
        let mut spans = vec![];
        if n_errors > 0 {
            spans.push(Span::styled(
                format!(" ✗ {} errors ", n_errors),
                Style::new().fg(Color::Red).add_modifier(Modifier::BOLD),
            ));
        }
        if n_alerts > 0 {
            spans.push(Span::styled(
                format!(" ⚠ {} alerts ", n_alerts),
                Style::new().fg(Color::Yellow).add_modifier(Modifier::BOLD),
            ));
        }
        Line::from(spans)
    } else {
        Line::from(vec![Span::styled(" ✓ all ok", Style::new().fg(Color::Green))])
    };

    let block = Block::default()
        .borders(Borders::BOTTOM)
        .border_style(Style::new().fg(Color::DarkGray));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    let header_line = Line::from(vec![left, Span::raw("  "), center, Span::raw("  "), right]);
    frame.render_widget(Paragraph::new(header_line), inner);
}
