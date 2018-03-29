import $ from 'jquery';

export default {
    /**
     * 渲染单位表格
     * 
     * @param totalRecord
     * 				总记录数
     * @param datas
     * 				候选单位列表列表
     */
    rendererTable(totalRecord,datas,selectedObjs){
        var tbody1 = document.getElementById("unSelectWorkitemTbody");
        //清空表格数据
        if(!datas || datas.length<1){
            this.noDatasRenderer(tbody1,7);
            return false;
        }
        var rowName = "itemName";
        //按行渲染表格
        for (var i=0;i<datas.length;i++){
            var tr = this.createRow4Data(i+1,datas[i],rowName,selectedObjs);
            tbody1.appendChild(tr);
        }
        //每一行的click事件
        var rows = $('tr[name="'+rowName+'"]');
        debugger;
        for(var i=0;i<rows.length;i++){
            var rowId = rows[i].id;
           var row =  $('#'+rowId);
           row.click(() => {
                this.clickRow(row);
                //选中某一行
            });
        }
    },

    /**
     * 创建单位表格的ROW
     * 
     * @param orders
     * 			序号
     * @param person
     * 			单位数据
     * @param rowName
     * 			行的name属性
     */
    createRow4Data(orders,item,rowName,selectedObjs){
        debugger;
        rowName = rowName || 'itemName';
        var tr = this.createRow(item.id,rowName);
        //设置id
        tr.setAttribute("id",item.id);
        //设置状态
        tr.setAttribute("alternativeorgselected",item.name);
        //序号列
        this.createTd(tr,orders,'center');
        //待选单位
        this.createTd(tr,item.name || '','center');
        //待选单位
        this.createTd(tr,item.importanceName || '','center');
        //判断该对象是否存在已选中的数组中
        $.each(selectedObjs,function(index,obj){
            if(parseInt(obj.id) === org.id){
                tr.setAttribute('class','ivu-table-row-highlight');
            }
        });
        return tr;
    },
    /**
     * 创建行tr
     * 
     * @param item
     */
    createRow(id,prefix){
        var tr = document.createElement('tr');
        //设置ID
        if(!prefix){
            tr.setAttribute("id","row_"+id);
        }else{
            tr.setAttribute("id","row_"+prefix+"_"+id);
        }
        tr.setAttribute("name",prefix);
        return tr;
    },
    /**
     *  创建TD
     * @param html
     * 			td的内容
     * @param alignM
     * 			居中方式
     * @param addClass
     * 			新增的className
     * 
     * @param title
     * 			td行显示的提示内容
     * 
     * @returns 返回创建的td
     * 
     *
     */
    createTd(tr,html,alignM,addClass, title,rowspan){
        rowspan = rowspan || 1;
        html = typeof html === "undefined" ?  "" : html;
        title =typeof title === "undefined" ? html : title;
        addClass=addClass||"";
        var td = document.createElement('td');
        //设置内容
        td.className ="ds-text-ellipsis "+addClass;
        td.innerHTML = html;
        td.setAttribute("title",title);
        td.setAttribute("style","text-align:"+alignM);
        if(rowspan >1){
            td.setAttribute("rowspan",rowspan);
        }
        //增加到tr上
        tr.appendChild(td);
        return td;
    },
    /**
     * row 的click事件
     * @param jQRow
     * 是否多选,默认单选
     *          true为多选
     *          false为单选
     */
    clickRow(jQRow){
        //渲染背景色
        debugger;
        var multiple = true;
        var flag = this.rowChangeBgColor(jQRow,multiple);
        if(!flag){
            return false;
        }
    },
    /**
     * 改变row的选中的背景色
     * 
     * @param row
     * 			需要改变背景色的行
     * @param multiple
     * 			是否多选,默认单选
     *          true为多选
     *          false为单选
     * @return true:选中；false:取消选中
     */
    rowChangeBgColor(row,multiple){
        multiple = multiple || false;
        //是否选中
        var selected = row.hasClass('ivu-table-row-highlight');
        if(!multiple){//只允许选择单行
            row.parent('tbody').children('tr').removeClass('ivu-table-row-highlight');
            row.addClass('ivu-table-row-highlight');
            return true;
        }else{//允许选择多行，选中的行均有背景色
            if(selected){
                row.removeClass('ivu-table-row-highlight');
                return false;
            }else{
                row.addClass('ivu-table-row-highlight');
                return true;
            }
        }
    },
    /**
     * 无数据渲染
     * @param tbody1
     * @param colNum
     * @returns
     */
    noDatasRenderer(tbody1,colNum){
        if(tbody1 && colNum){
            var td = document.createElement("td");
            td.innerHTML = '亲，没有查到您需要的数据.';
            td.setAttribute("align","center"); 
            td.setAttribute("colspan",colNum); 
            var tr = document.createElement("tr");
            tr.appendChild(td);
            tbody1.appendChild(tr);
            $(tbody1).attr('noData',true);
            return td;
        }
        return null;
    },    
    /**
     * 无数据渲染
     * @param tbody1
     * @param colNum
     * @returns
     */
    noDatasRenderer(tbody1,colNum){
        if(tbody1 && colNum){
            var td = document.createElement("td");
            td.innerHTML = '亲，没有查到您需要的数据.';
            td.setAttribute("align","center"); 
            td.setAttribute("colspan",colNum); 
            var tr = document.createElement("tr");
            tr.appendChild(td);
            tbody1.appendChild(tr);
            $(tbody1).attr('noData',true);
            return td;
        }
        return null;
    }

}