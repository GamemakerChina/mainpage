---
title: 基于JSON的简单本地化
date: 2023/12/26
categories:
 - 论坛教程
---

为了让尽可能多的受众了解您的游戏，您需要将游戏翻译成多种语言。最好的方法之一就是将字符串放在一个外部文本文件中，如 JSON 文件。有了外部文件，您就可以将所有本地化的字符串集中在一个文件中（而不必翻阅游戏源代码），然后发送给翻译您游戏的人。

强烈建议您在开发过程中尽早实施本地化框架。如果等待的时间太长，您会发现自己不得不梳理所有代码，找出任何显示给玩家的文本，并将其追溯转换为使用本地化框架，这可能会很费力和耗时，尤其是在游戏庞大复杂或有大量对话或其他文本的情况下。

**预期技能水平：**
中级水平，应能熟练编写 GML 代码。

## 开始

首先，您需要创建一个本地化控制器对象，我们称之为 `obLocalization`。它需要在游戏开始时调用，并在游戏打开的整个过程中保持激活状态。因此，您需要选中 "Persistent（持久）" 属性。

在 `obLocalization` 的创建事件中，添加以下代码：

```gml
///@desc Initialize
/* 确保已勾选 "Persistent（持久）" 属性！
启动游戏时创建此对象。它必须在整个游戏过程中保持激活状态。*/

//将默认语言设置为 ID 0。 以后添加保存/加载选项功能时可以更改。
global.currentLanguage = 0;

// 加载并解析可用本地化列表
var _availableLangsJsonStr = load_json_file_to_string("localization/availableLanguages.json");
availableLangsStruct = json_parse(_availableLangsJsonStr);

localizedStrings = {}; //初始化本地化字符串结构
set_language(global.currentLanguage);
```

这将加载包含可用语言列表的 JSON 文件。在本例中，起始语言是硬编码的。以后可以（也应该）将其转换为使用从游戏内配置菜单中保存/加载的设置，但这超出了本教程的范围。它使用了需要定义的自定义函数。

创建一个新的脚本资产，并将其命名为 `scLocalizationFunctions`。添加以下函数：

```gml
///@desc 返回从 JSON 文件加载的 JSON 字符串，并过滤掉（技术上非法的）注释
///@arg  {string} jsonFilePath JSON 文件的路径，例如 "localization/stringsEN.json"
///@returns {string} JSON 字符串
function load_json_file_to_string(jsonFilePath) {
    var _jsonFile = file_text_open_read(jsonFilePath); //打开文本文件
    var _jsonStr = "";
    var _stringLine = "";
    var _commentPosition = 0;
    if (_jsonFile != -1) { //如果文件成功打开
        while (!file_text_eof(_jsonFile)) { //运行至文件末尾
            _stringLine = file_text_readln(_jsonFile); //读取下一行
            _stringLine = string_trim(_stringLine); //删除行首和行尾的空白处
            _commentPosition = string_pos("//", _stringLine); //检查注释
            if (_commentPosition > 0) { //发现注释
                _stringLine = string_copy(_stringLine, 1, _commentPosition-1); //移除注释
            }

            _jsonStr += _stringLine; //为字符串添加一行
        }
        file_text_close(_jsonFile); //关闭文本文件
        return _jsonStr; //返回文件内容的字符串
    }
    else {
        throw ("File "+jsonFilePath+" not found!"); //错误：未找到文件
    }
}
```

这将加载给定的 JSON 文件，并在游戏中将数据转换为结构体。我还添加了允许 JSON 文件包含注释的功能，例如为翻译人员提供的特定行注释。根据 JSON 标准，注释在技术上是非法的，但这段代码会在导入时将其删除，从而使导入的数据符合 JSON 标准。

> 译者：事实上，GameMaker支持带有注释的JSON5，但是插件作者在论坛中表示先前并不知道。这并不是坏事——毕竟是一层保险措施。

要实际设置语言，您需要将此函数添加到 `scLocalizationFunctions` 中：

```gml
///@desc 设置游戏语言
///@arg {real} [langId] 根据 availableLanguages.json 中的列表顺序，选择要使用的语言的 ID 号
function set_language(langId) {
    global.currentLanguage = langId;
    //首先加载游戏的母语（此处为英语）本地化版本
    var _defaultJsonStr = load_json_file_to_string("localization/"+obLocalization.availableLangsStruct.langs[0].stringsFile);
    obLocalization.localizedStrings = json_parse(_defaultJsonStr);
    set_font_for_language(); //如果不想自动更改字体，请移除或注释此项

    //加载其他语言以覆盖母语。这样可以确保任何丢失的字符串都能
    //默认使用游戏的母语，而不会导致游戏崩溃。
    if (global.currentLanguage > 0) {
        var _localizationJsonStr = load_json_file_to_string("localization/"+obLocalization.availableLangsStruct.langs[global.currentLanguage].stringsFile);
        var _replacementStrings = json_parse(_localizationJsonStr);

        //逐步完成并替换字符串
        var _sectionNames = variable_struct_get_names(_replacementStrings);
        for (var _j = array_length(_sectionNames)-1; _j >= 0; --_j) {
            var _sectionName = _sectionNames[_j];
            var _sectionData = _replacementStrings[$ _sectionName];
            var _sectionDataArr = variable_struct_get_names(_sectionData);
            for (var _k = array_length(_sectionDataArr)-1; _k >= 0; --_k) {
                var _locReference = _sectionDataArr[_k];
                var _locText = _replacementStrings[$ _sectionName][$ _locReference];
                obLocalization.localizedStrings[$ _sectionName][$ _locReference] = _locText;
            }
        }
    }
}
```

这将首先加载游戏母语（本例中为英语）的字符串，然后如果您设置了英语以外的其他语言，则将用该语言覆盖字符串。这样做的原因是，如果您忘记本地化任何行，这些行就会返回到英语，而不会导致游戏崩溃。

您还需要添加一个字体资产，我们称之为 "fnMain"。将范围设置为 ASCII（32-255）。如果要包含使用非拉丁字母的语言（如中文），则需要添加额外的范围，并使用包含这些字符的字体。稍后再详述。

如果不同语言使用不同字体，则需要将此添加到 `scLocalizationFunctions` 中：

```gml
///@desc 将字体设置为 availableLanguages.json 中为给定语言指定的字体
///@arg {real} [forceLangId] 为给定的语言 ID 选择字体。默认为当前语言。
function set_font_for_language(forceLangId = global.currentLanguage){
    var _fontName = obLocalization.availableLangsStruct.langs[forceLangId].font;
    var _fontIndex = asset_get_index(_fontName);
    draw_set_font(_fontIndex);
}
```

## 添加 JSON 文件

现在让我们创建包含语言设置和翻译的 JSON 文件。在屏幕右侧的资产浏览器中，单击三杠菜单并选择 "包含文件"。单击 "在资源管理器中打开" 按钮，在 Windows 资源管理器中打开文件夹。创建一个名为 `localization` 的文件夹。在其中新建一个名为 `availableLanguages.json` 的文本文件。请注意，您需要确保 Windows 设置为显示文件扩展名。为了显示非 ASCII 字符，需要确保 JSON 文件采用 UTF-8 编码。要编辑该文件，记事本可以完成工作，但我建议使用专用的代码编辑器，如 Notepad++、Sublime Text 或 Visual Studio Code。在该JSON文件中，添加

```json5
//从技术上讲，这样的注释违反了 JSON 标准，但游戏会在加载文件时自动过滤掉它们
//这在您需要为特定行添加注释或指示时非常有用。
//注意：这只适用于双斜线注释，不适用于星形斜线注释。
//译者：还是上文的那句话，GameMaker 本来就没有遵循 JSON 标准，人家用的 JSON5。所以我认为其实诸如星形斜线注释也可以用。

{
    "langs": [
        { //列出的第一种语言是游戏的母语（本例中为英语）
            "langNameGameNative": "English", //语言的英文名称，如 Chinese
            "langNameLocal": "English",  //该语言中的名称，如 中文
            "stringsFile": "stringsEN.json", //包含给定语言字符串的 JSON 文件名称
            "font": "fnMain" //GameMaker 中字体资产的名称
        },
        {
            "langNameGameNative": "Chinese",
            "langNameLocal": "中文",
            "stringsFile": "stringsCN.json",
            "font": "fnMain"
        }
    ]
}
```

这将定义游戏的可用语言、给定语言的字符串在哪些 JSON 文件中，以及每种语言的设置。只需添加另一个部分、填写设置并创建相应的字符串 JSON 文件，即可添加其他语言。请注意，列表中的第一种语言被视为游戏的母语；其他语言中找不到的任何字符串都将返回母语。

现在，在 `availableLanguages.json` 的同一文件夹中为英文字符串创建 JSON 文件 `stringsEN.json`：

```json5
{
    "meta": {
        "langNameGameNative": "English", //语言的英文名称，如 Chinese
        "langNameLocal": "English" //该语言中的名称，如 中文
    },
    "menu": {
        "localizationExample": "Localization Example",
        "letsMakeGames": "Let's make some awesome games!"
    }
}
```

细心的读者可能会注意到，这些字符串位于 `"menu"` 部分。该系统允许您使用不同的部分对字符串进行分类，例如，您可以在 `"menu"` 部分中显示游戏菜单中的文本，在 `"dialog"` 部分中显示角色的对话。

现在创建一个中文本地化文件, `stringsCN.json`：

```json5
{
    "meta": {
        "langNameGameNative": "Chinese", //语言的英文名称，如 Chinese
        "langNameLocal": "中文" //该语言中的名称，如 中文
    },
    "menu": {
        "localizationExample": "本地化示例",
        "letsMakeGames": "让我们制作一些超棒的游戏吧！"
    }
}
```

## 在游戏中显示本地化文本

为了更加简洁，我建议在 `scLocalizationFunctions` 中添加以下内容：

```gml
#macro LOCALIZE obLocalization.localizedStrings
#macro localize obLocalization.localizedStrings
```

这样，您就可以在使用本地化字符串的地方使用 `LOCALIZE` 或 `localize`，而不是 `obLocalization.localizedStrings`，从而使代码更加简洁。

要访问游戏中的本地化文本，只需使用 `LOCALIZE.section.key`，将 `section` 和 `key` 替换为您正在使用的内容，例如 `LOCALIZE.menu.letsMakeGames`。例如，在用于显示文本的任何对象的 "绘制GUI界面" 事件中包含此内容：

```gml
draw_text(683,32,LOCALIZE.menu.letsMakeGames);
```

要更改语言，只需调用：

```gml
set_language(langId);
```

其中，`langId` 是 `availableLanguages.json` 中语言的索引，在本例中，0 表示英语，1 表示中文。

## 附件下载

**下载地址:** [市场](https://marketplace.gamemaker.io/assets/11920/easy-localization-with-json)

可下载内容包括一个完整的本地化启动框架，包含 4 种语言： 英语、法语、俄语和日语，以及系统运行演示。该系统已通过与 YoYo Compiler (YYC) 的兼容性测试。

## 其他注意事项

如前所述，如果您使用的是非拉丁字母的语言，则需要查找该语言字母的 Unicode 字符范围。字符范围通常以十六进制格式书写，但在导入 GameMaker 时需要将其转换为十进制格式。Windows 内置的计算器应用程序就具有这种功能。将计算器设置为程序员模式，选择 HEX，输入十六进制数，十进制数将显示在 DEC 旁边。

如果包含中文、日文或韩文，请注意这些语言有成千上万的字符，会影响编译速度。您需要注意它们在纹理页上所占的空间，可能需要增加纹理页的大小。如果您制作的是高清或 4K 游戏，而不是复古风格的像素艺术游戏，这一点尤其重要。如果您包含这些语言，建议您为每种语言使用单独的字体资产。节省纹理页面空间的一种方法是使用较小的字体大小，然后以更大的比例绘制文本，并使用 SDF 渲染来保持图像质量。另一种方法是在字体资产的字符范围中省略游戏中实际不使用的字符。对于韩语来说，这需要超过 10,000 个字符（一个音节中韩文字母的每一种排列）。对于日语，如果您将自己限制在平假名、片假名、标点符号和日本文部省批准的 2136 个 "常用汉字"（jōyō kanji）范围内，那么就非常容易管理了。

如果您使用的是希伯来语或阿拉伯语等从右到左的语言，则需要对用户界面中出现文本的任何地方进行定位和对齐调整，以使其看起来更美观（即右对齐而不是左对齐，并相应调整绘制原点），这可能是一个费力的过程。

如果使用的是 "填空" 字符串，请使用占位符标签，例如，`"timeRemaining"： "还剩 {0} 分钟。"`，然后使用一个字符串函数，即`string(LOCALIZE.menu.timeRemaining,5);`，这将产生`"还剩 5 分钟。"`。这样，您就可以在字符串中插入变量，如果变量发生变化，就不必在每种语言中都进行替换。

最后，在进行本地化时必须注意文化差异。好的本地化工作不仅仅是从一种语言翻译成另一种语言那么简单。某些事情，如笑话或流行文化引用，在其他语言或文化中可能没有意义，而一些在您的文化中相对无害或被接受的事情，在其他文化中可能非常令人反感，反之亦然。