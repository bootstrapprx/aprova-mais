use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Cell, Paragraph, Row, Table, TableState, Wrap},
    Frame,
};

use crate::types::{AppData, UiState};

pub fn render(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(8), Constraint::Length(10)])
        .split(area);

    render_container_table(frame, chunks[0], data, ui);
    render_detail_pane(frame, chunks[1], data, ui);
}

fn render_container_table(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Containers ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let widths = [
        Constraint::Length(14),
        Constraint::Length(12),
        Constraint::Min(14),
        Constraint::Length(10),
        Constraint::Length(12),
    ];

    let header = ["Name", "State", "Image", "Ports", "Health"]
        .iter()
        .map(|h| Cell::from(Span::styled(*h, Style::new().fg(Color::Green).add_modifier(Modifier::BOLD))))
        .collect::<Row>()
        .height(1);

    let rows: Vec<Row> = data.containers.iter().map(|c| {
        let state_color = match c.state.as_str() {
            "running" => Color::Green,
            "exited" => Color::Red,
            _ => Color::Yellow,
        };
        let health_color = match c.health.as_str() {
            "healthy" => Color::Green,
            "unhealthy" => Color::Red,
            _ => Color::Gray,
        };
        Row::new(vec![
            Cell::from(Span::styled(&c.name, Style::new().fg(Color::White))),
            Cell::from(Span::styled(&c.state, Style::new().fg(state_color).add_modifier(Modifier::BOLD))),
            Cell::from(Span::styled(&c.image, Style::new().fg(Color::Gray))),
            Cell::from(Span::styled(&c.ports, Style::new().fg(Color::DarkGray))),
            Cell::from(Span::styled(&c.health, Style::new().fg(health_color))),
        ])
    }).collect();

    let selected = ui.selected_container;
    let mut table_state = TableState::new().with_selected(selected);

    let table = Table::new(rows, widths)
        .header(header)
        .block(block)
        .highlight_style(Style::new().bg(Color::DarkGray).add_modifier(Modifier::BOLD));

    frame.render_stateful_widget(table, area, &mut table_state);
}

fn render_detail_pane(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Detail ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let inner = block.inner(area);

    if let Some(idx) = ui.selected_container {
        if let Some(c) = data.containers.get(idx) {
            let text = vec![
                Line::from(vec![Span::styled("Name:  ", Style::new().fg(Color::Cyan)), Span::raw(&c.name)]),
                Line::from(vec![Span::styled("Image: ", Style::new().fg(Color::Cyan)), Span::raw(&c.image)]),
                Line::from(vec![Span::styled("State: ", Style::new().fg(Color::Cyan)), Span::styled(&c.state, match c.state.as_str() { "running" => Style::new().fg(Color::Green), _ => Style::new().fg(Color::Red) })]),
                Line::from(vec![Span::styled("Ports: ", Style::new().fg(Color::Cyan)), Span::raw(&c.ports)]),
                Line::from(vec![Span::styled("Health:", Style::new().fg(Color::Cyan)), Span::styled(&c.health, match c.health.as_str() { "healthy" => Style::new().fg(Color::Green), _ => Style::new().fg(Color::Red) })]),
                Line::from(vec![Span::styled("Status:", Style::new().fg(Color::Cyan)), Span::raw(&c.status)]),
            ];
            frame.render_widget(Paragraph::new(text).wrap(Wrap { trim: false }), inner);
            frame.render_widget(block, area);
            return;
        }
    }

    frame.render_widget(block, area);
}
