use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Modifier, Style, Stylize},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Cell, Paragraph, Row, Table, Wrap},
    Frame,
};

use crate::types::AppData;

pub fn render(frame: &mut Frame, area: Rect, data: &AppData) {
    let chunks = Layout::default()
        .direction(Direction::Vertical)
        .constraints([Constraint::Length(3), Constraint::Min(5), Constraint::Min(5)])
        .split(area);

    render_db_summary(frame, chunks[0], data);
    render_table_stats(frame, chunks[1], data);
    render_active_queries(frame, chunks[2], data);
}

fn render_db_summary(frame: &mut Frame, area: Rect, data: &AppData) {
    let db = match &data.db {
        Some(d) => d,
        None => {
            frame.render_widget(
                Paragraph::new("Database info not available (no DB_URL configured)").style(Style::new().fg(Color::Gray)),
                area,
            );
            return;
        }
    };

    let line = Line::from(vec![
        Span::styled(" DB: aprova_mais ", Style::new().fg(Color::Green).add_modifier(Modifier::BOLD)),
        Span::raw("│"),
        Span::styled(format!(" Size: {:.1}MB ", db.size_bytes as f64 / 1_048_576.0), Style::new().fg(Color::White)),
        Span::raw("│"),
        Span::styled(format!(" Connections: {}/{} ", db.connections, db.max_connections), Style::new().fg(Color::White)),
        Span::raw("│"),
        Span::styled(format!(" Uptime: {} ", db.uptime), Style::new().fg(Color::DarkGray)),
    ]);

    let block = Block::default().borders(Borders::ALL).border_style(Style::new().fg(Color::DarkGray));
    let inner = block.inner(area);
    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(line), inner);
}

fn render_table_stats(frame: &mut Frame, area: Rect, data: &AppData) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Tables ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let db = match &data.db {
        Some(d) => d,
        None => { frame.render_widget(block, area); return; }
    };

    let widths = [Constraint::Length(22), Constraint::Length(10), Constraint::Length(12)];
    let header = Row::new(vec![
        Cell::from(Span::styled("Table", Style::new().fg(Color::Green).add_modifier(Modifier::BOLD))),
        Cell::from(Span::styled("Rows", Style::new().fg(Color::Green).add_modifier(Modifier::BOLD))),
        Cell::from(Span::styled("Size", Style::new().fg(Color::Green).add_modifier(Modifier::BOLD))),
    ]);

    let rows: Vec<Row> = db.table_stats.iter().map(|t| {
        Row::new(vec![
            Cell::from(Span::styled(&t.name, Style::new().fg(Color::White))),
            Cell::from(Span::styled(format!("{}", t.row_count), Style::new().fg(Color::Gray))),
            Cell::from(Span::styled(format!("{:.1}MB", t.size_bytes as f64 / 1_048_576.0), Style::new().fg(Color::Gray))),
        ])
    }).collect();

    let table = Table::new(rows, widths).header(header).block(block);
    frame.render_widget(table, area);
}

fn render_active_queries(frame: &mut Frame, area: Rect, data: &AppData) {
    let block = Block::default()
        .borders(Borders::ALL)
        .border_style(Style::new().fg(Color::DarkGray))
        .title(" Active Queries ")
        .title_style(Style::new().fg(Color::Cyan).add_modifier(Modifier::BOLD));

    let db = match &data.db {
        Some(d) => d,
        None => { frame.render_widget(block, area); return; }
    };

    let inner = block.inner(area);
    let text: Vec<Line> = if db.active_queries.is_empty() {
        vec![Line::from(vec![Span::styled(" No active queries", Style::new().fg(Color::Green))])]
    } else {
        db.active_queries.iter().map(|q| {
            Line::from(vec![
                Span::styled(format!(" {} ", q.pid), Style::new().fg(Color::Yellow)),
                Span::styled(&q.duration, Style::new().fg(Color::DarkGray)),
                Span::raw(" "),
                Span::styled(&q.state, Style::new().fg(Color::Cyan)),
                Span::raw(" "),
                Span::styled(&q.query, Style::new().fg(Color::White)),
            ])
        }).collect()
    };

    frame.render_widget(block, area);
    frame.render_widget(Paragraph::new(text).wrap(Wrap { trim: false }), inner);
}
