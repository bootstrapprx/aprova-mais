mod app;
mod config;
mod types;
mod collectors;
mod ui;
mod components;
mod actions;

use clap::Parser;

#[tokio::main]
async fn main() -> color_eyre::Result<()> {
    let args = config::Args::parse();
    app::run(args).await
}
