### 背景  
最近，接到了一个考试系统的项目。因为是与手机APP对接，管理后台需要有生成试卷二维码的功能。有一个要求：二维码需要动态生成，不同试卷对应不同的二维码。  
### 问题&方案    
之前，一直使用Ajax来异步请求数据，进行页面渲染。不同于以往的JSON数据格式，这次需要处理图片的二进制流数据。找到解决办法，还需要从Ajax背后原理入手。    
Ajax的本质是XMLHttpRequest，XMLHttpRequest一般用来发送和接收文本数据。XMLHttpRequest 2规范中加入了ResponseType属性，来支持发送和接收二进制数据。

> Value Data type of response property
"" (空字符串) :   字符串(默认值)
"arraybuffer" :   ArrayBuffer
"blob" :  Blob
"document" :  Document
"json" :   JavaScript 对象，解析自服务器传递回来的JSON 字符串。
"text" :  字符串  

所以，只要将ResponseType设定为 blob即可。  
### 实现代码  
```javascript
var xh = new XMLHttpRequest();
xh.open('POST', '/admin.php/admin_paper/paper/preview', true);
xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
xh.responseType = 'blob';
xh.onload = function(){
    if(this.status === 200){
        var blob = this.response;
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function(e){
            var img = document.createElement('img');
            img.onload = function(){
                document.getElementsByTagName('body')[0].appendChild(img);
            }
            img.src = e.target.result;
        }
    }else{
        alert('error');
    }
}
xh.send('id='+param.id+'&paper_name='+param.paper_name);
```  

因为，只要兼容到IE10切生成图片较小，所以使用HTML5新的属性，转换成了base64显示。

### 另一种解决方案  
利用XMLHttpRequest的.overrideMimeType()方法是一个解决方案，虽然它不是一个标准方法。

```javascript
var xh = new XMLHttpRequest();
xh.open('POST', '/admin.php/admin_paper/paper/preview', true);
xh.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
xh.overrideMimeType("text/plain; charset=x-user-defined");
xh.onload = function(){
    if(this.status === 200){
       console.log(this.responseText);
    }else{
        alert('error');
    }
}
xh.send('id='+param.id+'&paper_name='+param.paper_name);
```  

**注意:x-user-defined告诉浏览器不要解析数据**
