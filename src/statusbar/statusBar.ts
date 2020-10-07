/*
 * @Author: Gang Jiang
 * @Date: 2020-09-07 23:02:25
 * @LastEditors: Gang Jiang
 * @LastEditTime: 2020-10-07 08:32:47
 * @Description: 
 */
import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { LeekFundConfig } from '../shared/leekConfig';
import { LeekTreeItem } from '../shared/leekTreeItem';
import { LeekFundService } from '../explorer/service';

export class StatusBar {
  private service: LeekFundService;
  private fundBarItem: StatusBarItem;
  private statusBarList: StatusBarItem[] = [];
  constructor(service: LeekFundService) {
    this.service = service;
    this.statusBarList = [];
    this.fundBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 3);
    this.refreshStockStatusBar();
  }

  get riseColor(): string {
    return LeekFundConfig.getConfig('leek-fund.riseColor');
  }
  get fallColor(): string {
    return LeekFundConfig.getConfig('leek-fund.fallColor');
  }

  refresh() {
    this.refreshFundStatusBar();
    // this.statusBarList.forEach((bar) => bar.hide());
    this.refreshStockStatusBar();
  }

  refreshStockStatusBar() {
    const statusBarStockList = this.service.statusBarStockList;
    let count = statusBarStockList.length - this.statusBarList.length;
    if (count > 0) {
      while (--count >= 0) {
        const stockBarItem = window.createStatusBarItem(StatusBarAlignment.Left, 3);
        this.statusBarList.push(stockBarItem);
      }
    } else if (count < 0) {
      let num = Math.abs(count);
      while (--num >= 0) {
        const bar = this.statusBarList.pop();
        bar?.hide();
        bar?.dispose();
      }
    }
    statusBarStockList.forEach((stock, index) => {
      this.udpateBarInfo(this.statusBarList[index], stock);
    });
  }

  udpateBarInfo(stockBarItem: StatusBarItem, item: LeekTreeItem | null) {
    if (!item) {
      return;
    }
    const { type, symbol, price, percent, open, yestclose, high, low, updown } = item.info;
    const deLow = percent.indexOf('-') === -1;
    stockBarItem.text = `「${this.service.showLabel ? item.info.name : item.id}」${price}  ${
      deLow ? '📈' : '📉'
    }（${percent}%）`;

    stockBarItem.tooltip = `【今日行情】${type}${symbol}\n涨跌：${updown}   百分：${percent}%\n最高：${high}   最低：${low}\n今开：${open}   昨收：${yestclose}`;
    stockBarItem.color = deLow ? this.riseColor : this.fallColor;
    stockBarItem.show();
    return stockBarItem;
  }

  refreshFundStatusBar() {
    this.fundBarItem.text = `$(pulse)`;
    this.fundBarItem.color = this.riseColor;
    this.fundBarItem.tooltip = this.getFundTooltipText();
    this.fundBarItem.show();
    return this.fundBarItem;
  }

  private getFundTooltipText() {
    let fundTemplate = '';
    for (let fund of this.service.fundList.slice(0, 14)) {
      fundTemplate += `${
        fund.info.percent.indexOf('-') === 0 ? ' ↓ ' : fund.info.percent === '0.00' ? '' : ' ↑ '
      } ${fund.info.percent}%   「${
        fund.info.name
      }」\n--------------------------------------------\n`;
    }
    // tooltip 有限定高度，所以只展示最多14只基金
    const tips = this.service.fundList.length >= 14 ? '（只展示前14只）' : '';
    return `\n【基金详情】\n\n ${fundTemplate}${tips}`;
  }
}
