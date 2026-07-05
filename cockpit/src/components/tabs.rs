use ratatui::{
    layout::Rect,
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::types::Tab;

pub fn render(frame: &mut Frame, area: Rect, active_tab: &Tab) {
    let block = Block::default()
        .borders(Borders::BOTTOM)
        .border_style(Style::new().fg(Color::DarkGray));

    let inner = block.inner(area);
    frame.render_widget(block, area);

    let mut spans = Vec::new();
    for tab in Tab::ALL {
        let is_active = tab == active_tab;
        let label = tab.label();
        if is_active {
            spans.push(Span::styled(
                format!(" {} ", label),
                Style::new()
                    .fg(Color::Green)
                    .bg(Color::DarkGray)
                    .add_modifier(Modifier::BOLD),
            ));
        } else {
            spans.push(Span::styled(
                format!(" {} ", label),
                Style::new().fg(Color::Gray),
            ));
        }
        spans.push(Span::raw(" │"));
    }
    spans.pop();

    frame.render_widget(Paragraph::new(Line::from(spans)), inner);
}
