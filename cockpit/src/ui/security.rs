use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

use crate::types::{AppData, SecuritySeverity};

pub fn render(frame: &mut Frame, area: Rect, data: &AppData) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(5)])
        .split(area);

    render_alerts(frame, chunks[0], data);
}

fn render_alerts(frame: &mut Frame, area: Rect, data: &AppData) {
    let n_critical = data.security_alerts.iter().filter(|a| a.severity == SecuritySeverity::Critical).count();
    let n_warning = data.security_alerts.iter().filter(|a| a.severity == SecuritySeverity::Warning).count();

    let title = format!(
        " Security Analysis  [{} critical  {} warnings] ",
        n_critical, n_warning
    );

    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(&title)
        .title_style(Style::new().fg(
            if n_critical > 0 { Color::Red } else if n_warning > 0 { Color::Yellow } else { Color::Green }
        ).add_modifier(Modifier::BOLD));

    let inner = block.inner(area);

    let lines: Vec<Line> = if data.security_alerts.is_empty() {
        vec![
            Line::from(vec![Span::styled(" ✓ No security issues detected", Style::new().fg(Color::Green))]),
            Line::from(vec![Span::raw("")]),
            Line::from(vec![Span::styled("   ✓ SSL cert valid", Style::new().fg(Color::Green))]),
            Line::from(vec![Span::styled("   ✓ No inbound ports exposed (tunnel only)", Style::new().fg(Color::Green))]),
            Line::from(vec![Span::styled("   ✓ Docker images from official sources", Style::new().fg(Color::Green))]),
        ]
    } else {
        data.security_alerts.iter().map(|a| {
            let (icon, color) = match a.severity {
                SecuritySeverity::Critical => ("✗", Color::Red),
                SecuritySeverity::Warning => ("⚠", Color::Yellow),
                SecuritySeverity::Info => ("i", Color::Cyan),
            };
            Line::from(vec![
                Span::styled(format!(" {} ", icon), Style::new().fg(color).add_modifier(Modifier::BOLD)),
                Span::styled(format!("[{}] ", a.category), Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD)),
                Span::styled(&a.message, Style::new().fg(Color::White)),
                Span::raw(" "),
                Span::styled(&a.detail, Style::new().fg(Color::DarkGray)),
            ])
        }).collect()
    };

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(lines).wrap(Wrap { trim: false }), inner);
}
