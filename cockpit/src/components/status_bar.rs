use ratatui::{
    layout::Rect,
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span},
    widgets::Paragraph,
    Frame,
};

use crate::types::Tab;

pub fn render(frame: &mut Frame, area: Rect, tab: &Tab) {
    let help = match tab {
        Tab::Dashboard => " [Tab/←→] navigate  [r] refresh  [q] quit  [h] help",
        Tab::Containers => " [↑↓] scroll  [Enter] detail  [r] restart  [l] logs  [q] quit",
        Tab::Database => " [r] refresh  [q] quit",
        Tab::Deploy => " [d] deploy  [Space] toggle log  [q] quit",
        Tab::Logs => " [↑↓] scroll  [s]ource filter  [/] search  [q] quit",
        Tab::Security => " [r] rescan  [q] quit",
    };

    let line = Line::from(vec![
        Span::styled(" ⌘ ", Style::new().fg(Color::Cyan)),
        Span::styled(help, Style::new().fg(Color::DarkGray)),
    ]);

    frame.render_widget(Paragraph::new(line).style(Style::new().bg(Color::Black)), area);
}
