use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

use crate::types::{AppData, LogEntry, UiState};

pub fn render(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Length(3), Constraint::Min(5)])
        .split(area);

    render_filter_bar(frame, chunks[0], ui);
    render_log_entries(frame, chunks[1], data, ui);
}

fn render_filter_bar(frame: &mut Frame, area: Rect, ui: &UiState) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray));

    let inner = block.inner(area);
    let line = Line::from(vec![
        Span::styled(" Filter: ", Style::new().fg(Color::Cyan)),
        Span::styled(&ui.log_source_filter, Style::new().fg(Color::White).add_modifier(Modifier::BOLD)),
        Span::raw("  "),
        if ui.log_search.is_empty() {
            Span::styled("[/] search", Style::new().fg(Color::DarkGray))
        } else {
            Span::styled(format!("[/] {} ", ui.log_search), Style::new().fg(Color::Yellow))
        },
    ]);

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(line), inner);
}

fn render_log_entries(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray));

    let inner = block.inner(area);

    let entries: Vec<&LogEntry> = data.logs.iter()
        .filter(|l| {
            if ui.log_source_filter != "all" && l.source != ui.log_source_filter {
                return false;
            }
            if !ui.log_search.is_empty() && !l.message.contains(&ui.log_search) {
                return false;
            }
            true
        })
        .collect();

    let lines: Vec<Line> = if entries.is_empty() {
        vec![Line::from(vec![Span::styled(" No matching log entries", Style::new().fg(Color::Gray))])]
    } else {
        entries.iter().rev().take(100).rev().map(|e| {
            let level_color = match e.level.as_str() {
                "error" => Color::Red,
                "warn" => Color::Yellow,
                "info" => Color::White,
                _ => Color::Gray,
            };
            let source_color = match e.source.as_str() {
                "app" => Color::Green,
                "nginx" => Color::Cyan,
                "db" => Color::Blue,
                "auth" => Color::Magenta,
                "tunnel" => Color::Yellow,
                _ => Color::Gray,
            };
            Line::from(vec![
                Span::styled(format!(" {}", e.timestamp.format("%H:%M:%S")), Style::new().fg(Color::DarkGray)),
                Span::raw(" "),
                Span::styled(format!("[{}]", e.source), Style::new().fg(source_color).add_modifier(Modifier::BOLD)),
                Span::raw(" "),
                Span::styled(&e.message, Style::new().fg(level_color)),
            ])
        }).collect()
    };

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(lines).wrap(Wrap { trim: false }), inner);
}
