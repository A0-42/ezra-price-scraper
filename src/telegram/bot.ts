// Telegram Bot for Ezra Price Scraper
// Sends error notifications only, on demand as specified in PRD

import TelegramBot from './telegram/bot.js';

export interface TelegramConfig {
  botToken: string;
  chatId: string;
}

export class TelegramBot {
  private config: TelegramConfig;
  private bot: any; // Telegram Bot API instance

  constructor(config: TelegramConfig) {
    this.config = config;
    this.bot = null; // Will be initialized
  }

  async initialize(): Promise<void> {
    if (!this.bot) {
      // Initialize Telegram Bot API
      const { Telegraf, Markup } = require('telegraf');
      
      this.bot = new Telegraf(this.config.botToken);
      
      // Error handling
      this.bot.command('error', (ctx) => {
        return ctx.reply(`🚨 Error: ${ctx.message}`);
      });
      
      console.log("✅ Telegram bot initialized");
    }
  }

  async sendError(message: string, error?: Error): Promise<void> {
    if (!this.bot) {
      console.warn("⚠️ Telegram bot not initialized");
      return;
    }

    try {
      await this.bot.telegram.sendMessage(
        this.config.chatId,
        `🚨 Ezra Price Scraper Error:\n\n${message}${error ? `\n\nStack: ${error.stack}` : ''}`
      );
      
      console.log(`✅ Error notification sent: ${message}`);
    } catch (error) {
      console.error(`❌ Failed to send Telegram notification:`, error.message);
    }
  }

  async sendTestNotification(): Promise<void> {
    await this.sendError("Test notification - Please ignore", undefined);
  }
}

export const telegramBot = new TelegramBot({
  botToken: process.env.TELEGRAM_BOT_TOKEN || "YOUR_BOT_TOKEN",
  chatId: process.env.TELEGRAM_CHAT_ID || "YOUR_CHAT_ID"
});