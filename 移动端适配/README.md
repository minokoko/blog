## rem适配  
### 什么是rem 
rem —— Font size of the root element，相对于根元素的字体大小。  
这里的根元素是**html**标签。  
示例：  
```html
<!DOCTYPE html>
<html lang="zh-CN" style="font-size: 10px;">
<head>
    <meta charset="utf-8">
    <title>rem demo</title>
    <style>
        p{
            color: #f0f;
            font-size: 1.4rem;
        }
    </style>
</head>
<body>
    <p>
        这是一行1.4rem的文字。
    </p>
    <div style="font-size: 20px">
        <p>
            这是一行嵌套到设置了font-size为20px的DIV内部的文字。
        </p>
    </div>
</body>
</html>
```
结果，两行P字号都为14px，非html标签设定的font-size对于rem无效。  
还需注意，大部分浏览器默认的字号是16px,若不设定具体的根font-size则以16px为标准。