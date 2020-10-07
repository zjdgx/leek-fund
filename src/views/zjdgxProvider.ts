/*
 * @Author: Gang Jiang
 * @Date: 2020-09-13 09:04:27
 * @LastEditors: Gang Jiang
 * @LastEditTime: 2020-09-13 10:01:11
 * @Description: 
 */
import { Event, EventEmitter, TreeDataProvider, TreeItem } from 'vscode';
import { LeekFundService } from '../service';
import { LeekTreeItem } from '../leekTreeItem';
import { LeekFundModel } from './model';

export class Zjdgx  implements TreeDataProvider<LeekTreeItem>{
  private service: LeekFundService;
  private model: LeekFundModel;

  constructor (service: LeekFundService) {
    this.service = service;
    this.model = new LeekFundModel();
  }

  getChildren(): LeekTreeItem[] | Thenable<LeekTreeItem[]> {
    return this.service.getZjdgxData();
  }

  getTreeItem(element: LeekTreeItem): TreeItem {
    return element;
  }
}