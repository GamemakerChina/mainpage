什么是CAT
----
OmegaT是一个进行计算机辅助翻译的开源工具。

在文档或软件翻译以及本地化领域，CAT是重要的翻译辅助工具。CAT是 Computer Assisted Translation 的缩写，即计算机辅助翻译，这种工具的核心是利用翻译记忆（Translation Memory，缩写TM）和词汇表（Glossaries），可以在翻译人员在遇到类似句子和相同词汇时提供之前的翻译作为参考，让翻译人员选择较适合的翻译。

基本的安装和使用在教程(OmegaT打开后按F1)中都有，在这里介绍通过git进行版本协作的方式。

工作环境
----
* OmegaT : [OmegaT官网](http://omegat.org/zh_CN/)
* JAVA环境：OmegaT需要在JAVA环境下工作，如果没有安装可以选择“with JRE”的版本安装。
* GIT工具：[git命令行工具下载](https://git-scm.com/downloads)。根据你的电脑的情况安装对应的版本。

帐户设置
----
首先注册一个github帐号。
设置帐户，右键菜单调出 git bash 命令行输入：

    git config --global user.email "you@example.com"
    git config --global user.name "YourName"

比如我的信息

    git config --global user.email "deciia@qq.com"
    git config --global user.name "deciia"

如果安装了小乌龟（TortoiseGit），SourceTree 等可视化工具操作会更方便，右键 - 小乌龟 - 设置 - 点中GIT的图标 - 看到用户信息 输入名字和email。若使用 SourceTree 可以直接绑定 GitHub 账号即可。

GMS2文档本地翻译
----
打开OmegaT软件，在OmegaT"项目"菜单下选中“下载团队项目”，将github项目地址粘贴到“版本库网址”一栏中，等待几秒，软件会自动分析是否是git项目然后提供一个默认的存放地址，你也可以选择你的存放的本地位置。之后OmegaT会自动下载，等待完成之后，会自动打开未翻译的一篇。

![在这里输入图片描述][10]


几个常用的操作
------

- 选择文档：“项目”菜单 - “项目文件”（ctrl+L）可以看到项目的文档，点击”文件名“字段进行排序，选择你要翻译的文档。
- 保存：  (ctrl+s) 会自动同步，第一次会提醒你输入用户名和密码，输入github的登录帐号和密码就可以了。
- **注意：如果你的 Github 账户开启了两步验证，可以在[这里](https://github.com/settings/tokens)找到 Personal access token，点击 Generate new token 输入账户密码后随便取个名字，然后在 Select scopes 中勾选 repo，可以得到已经生成的 token，将 Github 提供的 token 输入到 OmegaT 提醒你输入的密码中即可（用户名还是你的用户名）。请妥善保管 token，忘记了需重新生成。**
- **注意2：由于众所周知的原因，GitHub 的访问非常不稳定，如果无法让 OmegaT 保持连接 GitHub，可以选择 Proxifier + 梯子对 OmegaT 单独设置代理，或通过 SourceTree 等工具手动提交，若选择手动提交，请每次进行翻译之前手动拉取最新记录，同时尽量避免与其他人冲突**

![在这里输入图片描述][12]

- 设置机器翻译：选项 - 机器翻译 - 选择对应的机器翻译，默认的是自己的人工翻译，可以多选其它的。

> 如果有全币种信用卡，可以申请谷歌和微软的翻译api，有了api，基本上就是确认翻译结果，然后根据语境作出调整了。omegat 的 帮助文档 安装 从命令行启动 这一节有设置api的说明。选项-机器翻译 可以选择开启指定的api。编辑 - 用机器翻译替换 （ctrl + M） 可以快捷操作。

- 添加字典：目前已经安装了字典，如果觉得字典不够，可以在[这里][13]查找安装。

- 翻译操作：双击一个编辑器（正文）中的一段待翻译的英文片段，会分成相同内容的上下两行，上面一行是原文，在下面一行进行编辑翻译。该片段翻译完成之后，双击下一个片段或者使用快捷键Ctrl+U切换到下一片段，详细操作可以查看f1或者菜单的快捷键。

- 添加词汇表（术语库） ：右键”添加词汇表条目“。

- 右键菜单 创建可选译文，相同的片段，如果是一个多义词或者不同的境存在不同的翻译，可以为当前的情境创建一个可选的译文。

- 右键菜单  register identical translation 这个是将一个译文标记为已经翻译，比如有一些需要保持原文的。

- 添加笔记：选中一个片段之后，可以在笔记那一栏作笔记，某些情况，如不如确定用哪种翻译比较好，看到协作成员某个翻译感觉不够适当又不方便直接修改时，可以添加笔记，菜单栏可以切换笔记。

帮助菜单下面的f1文档也很详细，有时间可以仔细阅读一下。

## 安装机器翻译插件（以腾讯机器翻译插件为例）

从这里下载插件（最新版本我们已编译好）：[GamemakerChina/omegat-tencent-plugin](https://github.com/GamemakerChina/omegat-tencent-plugin/releases/tag/0.3)

将下载好的插件放入 OmegaT 的安装目录中的 `plugins` 下（一般为 `C:\Program Files\OmegaT` 或  `C:\Program Files(x86)\OmegaT` ，若安装在其他路径请以你电脑的路径为准）

![](https://cdn.jsdelivr.net/gh/GamemakerChina/gamemakerchina.github.io@master/screenshots/screenshot-5.png)

此时再启动 OmegaT（若已经启动请重启 OmegaT），在 `选项 --> 首选项 --> 机器翻译` 中找到 `Tencent Translate`，点击右边的启动后，点击 `配置`，输入腾讯云提供的 `SecretId` 和 `SecretKey` 后保存，此时可以在`机器翻译`选项卡中看到输出的翻译结果。

![](https://cdn.jsdelivr.net/gh/GamemakerChina/gamemakerchina.github.io@master/screenshots/screenshot-6.png)

对于其他已有的翻译插件步骤类似或相同（如有道翻译和彩云小译），部分插件可能不需要密钥（如无需密钥的 Google Translate (without API Key)）。

翻译中的注意事项
----

## 对于不需要翻译的内容

不需要翻译的内容请对对应词条右键，选择 `登记全同译文`（快捷键为 `Ctrl + Shift + S`），它将不会被翻译也不会作为未翻译词条显示。

![](https://cdn.jsdelivr.net/gh/GamemakerChina/gamemakerchina.github.io@master/screenshots/screenshot-3.png)

## 格式标签

`<i3><f2><b2>` 这种是格式标签，注意翻译的内容与格式化标签的位置关系。
![在这里输入图片描述][14]
每个文档前后的 `.css style` 以及文档里面的 `.html` 这样的扩展名可能是格式化时有个设置没有调好，这个不需要翻译，且注意保留，可直接登记全同译文。

之前已经翻译好的完全匹配的句子或词汇会自动替换，也可以设置 选项 -编辑行为 - 插入模糊匹配 在编辑的时候自动插入比较符合的匹配翻译。

同时请务必保持 `片段属性` 在能够看到的地方，同时观察注释，标签为 `META`，`LINK`，`A`，`IMG` 的不进行翻译，请直接登记全同译文。

![](https://cdn.jsdelivr.net/gh/GamemakerChina/gamemakerchina.github.io@master/screenshots/screenshot-1.png)

## GML 部分的问题

由于 OmegaT 的过滤器问题，GML 部分中（`GML_Overview` 和 `GML_Reference`）的代码范例也会被当作词条进入待翻译界面，如有此问题请务必对照原版文档，同时登记为全同译文。

![](https://cdn.jsdelivr.net/gh/GamemakerChina/gamemakerchina.github.io@master/screenshots/screenshot-2.png)

## 错误警告

如果翻译中出现标签错误的警告，之后忘记去修复，可以在**工具** 菜单 **检测当前文档标签** 检测一下，然后修复标签，把相应的文字再添加上标签。

![在这里输入图片描述][16]

不然，合并项目后用omegat打开会报这样的错误。

![在这里输入图片描述][15]

翻译内容导出
----
目前只要翻译记忆库就可以，导出操作推荐由一个人完成。如果要查看翻译的效果，可以在文件菜单下导出整个已译的内容或者当前页。

GameMaker Studio2软件目录里的最近版本的文档中的 source/_build 里的文件复制到翻译项目目录里的 source / _build 里，然后打开 omegat菜单 - 导出全部翻译的文件，然后关闭 omegat（它会自动同步，所以要关掉），再将生成的target里的东西复制到 docs 里的  source / _build 里，提交推送。


翻译导出的放进js文件后，需要转成utf-8编码。

[7]: https://dn-coding-net-production-static.qbox.me/49995c3d-5df2-49ae-8cb5-9318b8eeda22.png
[8]: https://dn-coding-net-production-static.qbox.me/b93193ab-778c-42f4-ac85-204c222b7bd0.png
[9]: https://coding.net/u/deciia/p/GMS2_help/git
[10]: https://dn-coding-net-production-static.qbox.me/ead0d5c3-ef4c-46d2-b636-7e92a2d668ba.png
[11]: https://coding.net/u/deciia/p/5pice/git
[12]: https://dn-coding-net-production-static.qbox.me/b90f37be-cfc1-4a7d-bcab-90cea1dc4d95.png
[13]: https://coding.net/u/deciia/p/5pice/topic/42896
[14]: https://dn-coding-net-production-static.qbox.me/c69ed993-eb1b-46c1-aa62-c323d8a4a45a.png
[15]: https://dn-coding-net-production-pp.qbox.me/085cc571-6cc1-423f-9488-85bdd48bdbeb.png
[16]: https://dn-coding-net-production-pp.qbox.me/3ad10b55-72c5-4cb3-b40d-5cbe016c2d60.png