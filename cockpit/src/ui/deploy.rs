use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Paragraph, Wrap},
    Frame,
};

use crate::types::{AppData, DeployStatus, StepStatus, UiState};

pub fn render(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Min(6), Constraint::Min(6)])
        .split(area);

    render_steps(frame, chunks[0], &data.deploy_status);
    render_log(frame, chunks[1], &data.deploy_status, ui);
}

fn render_steps(frame: &mut Frame, area: Rect, status: &DeployStatus) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Deploy Steps ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let inner = block.inner(area);
    let mut lines = Vec::new();

    for (i, step) in status.steps.iter().enumerate() {
        let (icon, color) = match &step.status {
            StepStatus::Pending => ("○", Color::Gray),
            StepStatus::Running => ("◌", Color::Yellow),
            StepStatus::Success => ("✓", Color::Green),
            StepStatus::Failed(e) => ("✗", Color::Red),
        };

        let step_num = i + 1;
        let label = &step.name;
        lines.push(Line::from(vec![
            Span::styled(format!(" {} ", icon), Style::new().fg(color).add_modifier(Modifier::BOLD)),
            Span::styled(format!("{}. {}", step_num, label), Style::new().fg(Color::White)),
        ]));
    }

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(lines), inner);
}

fn render_log(frame: &mut Frame, area: Rect, status: &DeployStatus, ui: &UiState) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Log Output ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let inner = block.inner(area);

    let text: Vec<Line> = if status.log.is_empty() {
        vec![Line::from(vec![Span::styled(" Press 'd' to start deployment ", Style::new().fg(Color::Gray))])]
    } else {
        status.log.lines().map(|l| {
            Line::from(Span::raw(l.to_string()))
        }).collect()
    };

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(text).wrap(Wrap { trim: false }), inner);
}
