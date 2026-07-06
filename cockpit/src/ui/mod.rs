pub mod dashboard;
pub mod containers;
pub mod database;
pub mod deploy;
pub mod logs;
pub mod security;

use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Style},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::types::{AppData, UiState};

pub fn render_content(frame: &mut Frame, area: Rect, data: &AppData, ui: &UiState) {
    match ui.tab {
        crate::types::Tab::Dashboard => dashboard::render(frame, area, data),
        crate::types::Tab::Containers => containers::render(frame, area, data, ui),
        crate::types::Tab::Database => database::render(frame, area, data),
        crate::types::Tab::Deploy => deploy::render(frame, area, data, ui),
        crate::types::Tab::Logs => logs::render(frame, area, data, ui),
        crate::types::Tab::Security => security::render(frame, area, data),
    }
}
