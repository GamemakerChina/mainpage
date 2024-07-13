---
title: 【插件】协程
date: 2021/12/5
categories:
 - 插件教程
---

协程是由@jujuadams为GameMaker Studio 2.3.6及以上版本设计的一套在GML中异步执行代码的语法扩展

---

**适用GM版本** : 2.3.6+

**适用目标平台** ：除HTML5之外的一切平台。

**下载连接**：[Github](https://github.com/JujuAdams/Coroutines/releases)

## 常见问题解答
### 协程在哪些平台上有效？

除了HTML5之外的所有平台。我目前只在Windows上进行了测试。由于它是纯原生GML，所以应该可以直接使用。在我不经常测试的平台上，你可能会遇到一些边缘情况；如果你发现任何bug，请[报告](https://github.com/JujuAdams/Coroutines/issues)。

### 这个代码库的许可证是什么？我可以将它用于商业项目吗？

[这个库是基于MIT许可证发布的](https://github.com/JujuAdams/Coroutines/blob/master/LICENSE)。这意味着你可以将它用于任何目的，包括商业项目。如果你能在你的游戏中提到我的名字（Juju Adams）和/或表示感谢，那对我来说意义重大，但你没有义务这么做。

### 我认为你缺少了一个有用的功能，希望你能实现它！

太好了！请提交一个[功能请求](https://github.com/JujuAdams/Coroutines/issues)。功能请求使协程更加有趣，也给了我在公共交通上无聊时的思考素材。

### 我发现了一个bug，它既让我害怕又略微烦恼。解决这个问题的最佳方法是什么？

请提交一个[bug报告](https://github.com/JujuAdams/Coroutines/issues)。Juju每天都会检查GitHub，通常几天后就会发布bug修复。你也可以在[Discord服务器](https://discord.gg/8krYCqr)上找到我，但这不能代替清晰的bug报告。

### 救命！我在编译时遇到了关于异步事件的错误。

由于GMS2.3.6更改了一些与异步事件相关的常量名称，GameMaker v2.3.6之前的版本将无法编译此库。你可以通过查找GM文档中的旧名称并替换它们来自己解决这个问题。

### 协程与[GMLive](https://yellowafterlife.itch.io/gamemaker-live)兼容吗？

我还没有测试过。请让我知道你的发现。

### 说到[YellowAfterlife](https://yellowafterlife.itch.io/)，他也通过GMEdit[实现了协程](https://github.com/YellowAfterlife/GMEdit/wiki/Using-%23gmcr-magic)。这个库有何不同？

Vadim在GameMaker Studio 2.3引入匿名函数之前就实现了他的协程。它是一个非常聪明的技术解决方案，解决了旧版本GM中许多缺失的功能。幸运的是，现在GameMaker更加灵活，这个库充分利用了新功能来实现协程。

### 谁编写了代码？

这个库是由[@jujuadams](https://twitter.com/jujuadams)构建和维护的，他长期以来一直在研究GameMaker的内部机制。Juju参与了许多[商业GameMaker游戏](http://www.jujuadams.com/)的开发。

许多宏的想法基于[Katsaii](https://nuxiigit.github.io/)在她著名（臭名昭著？）的[宏黑客文章](https://nuxiigit.github.io/content/blog/post/gml+syntax+extensions.html)中提出的想法。[shdwcat](https://github.com/shdwcat)也在库的公共发布前提供了一些建议，帮助指导了库的发展方向，她从编写自己的协程系统中学到了一些东西。

### 我可以向你捐款吗？你会开始一个Patreon吗？

感谢你愿意表示感谢——这对我个人来说意义重大——但我很幸运能从游戏开发中获得稳定的收入。我目前没有打算作为创作者加入Patreon。如果你想支持我的工作，可以在你的游戏中提到我，和/或在你选择的社交媒体平台上给我一个喊话。

## 协程简介
*本节是一个关于协程如何帮助你制作游戏的高级描述。如果你想了解更技术性的描述，请参见 [[协程是如何执行的？]] 和 [[我们如何扩展GML？]]*

当你编写代码并运行你的游戏时，你编写的代码是按顺序执行的，每个命令在前一个命令完成后立即执行。我们将代码存储在函数中，意图是程序将从一个函数移动到下一个函数，使游戏工作。当程序进入一个函数时，它必须完成整个函数（或至少到达一个 `return` 命令）后才能退出该函数并运行其他代码。这被称为“同步执行”，这是GameMaker的工作方式——代码是同步运行的，一行接一行，每帧数千行代码分布在数百个函数中。

异步函数的操作方式不同。异步函数**不需要**在程序离开该函数并做其他事情之前完全完成所有代码，更重要的是，异步函数可以从暂停的地方继续执行。这意味着你可以编写一些代码，在执行过程中允许整个程序去做其他事情，然后稍后再回到该函数继续执行。

此库允许你在GameMaker中编写可暂停的函数。这些可暂停的函数称为“协程”：一段可以在执行过程中暂停并在稍后继续的代码块。

许多语言原生支持编写异步代码，无论是作为核心语言特性，还是作为支持异步执行的库。GML属于后者。因此，有必要开发我们自己的系统来模拟支持异步函数的语言的特性和行为。从纯函数构建协程是笨拙且难以理解的，因此此库[扩展了GML的语法](Coroutines/wiki/Coroutine-Syntax)，以便我们能够以更优雅的方式描述协程。

### 一个示例

让我们来看一个简单的例子：过场动画。

制作过场动画是一场噩梦，多年来人们花费了大量精力设计和构建不同的解决方案来解决过场动画问题。最常见的解决方案是使用一个大的 switch...case 语句来控制哪个实例在什么时候做什么。构建这些系统非常耗时，而且它们总是最终变得丑陋且难以管理。实际上，我们想要的过场动画函数是一个异步函数——一个可暂停的函数，它可以向游戏传递指令以动画化对象和显示文本，而不会阻止游戏的其余部分运行。

这里是一个过场动画的示例。稍后我们会详细解释发生了什么，但这应该会让你了解使用协程可以实现的功能：

```
function CutsceneFindMyFroggy()
{
	return CO_BEGIN
		// 防止玩家使用正常的控制移动
		oPlayer.inCutscene = true;
		
		// 让玩家走进房间
		WHILE (oPlayer.x != 55) THEN
			oPlayer.x = min(oPlayer.x + 2, 55);
			YIELD THEN
		END
		
		// 显示一些对话
		oTextbox.text = "我的青蛙在哪里？";
		oTextbox.expression = sPlayerSad;
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		oTextbox.text = "...";
		
		// 为了喜剧效果暂停片刻
		DELAY 350 THEN // 毫秒
		
		oTextbox.text = "呱呱！";
		oTextbox.expression = sFrog;
		audio_play_sound(sndLonelyRibbit, 1, false);
		
		// 让青蛙跳进玩家的怀里
		WHILE (oFrog.x != 55) THEN
			oFrog.x = max(oFrog.x - 2, 55);
			YIELD THEN
		END
		
		oTextbox.text = "啊，她在这儿！谁是我的美丽两栖动物？";
		oTextbox.expression = sPlayerHappy;
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		oTextbox.text = "呱呱！ :)";
		oTextbox.expression = sFrog;
		audio_play_sound(sndHappyRibbit, 1, false);
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		// 清空文本框然后释放玩家
		oTextbox.text = "";
		player.inCutscene = false;
	CO_END
}
```

这种语法与普通的GML有些不同。特别值得注意的是使用了一些新的流程控制关键字。你可能以前见过 `WHILE`（虽然是小写的 `while` 循环命令），但很多其他全大写的命令是新的或不熟悉的。

`CO_BEGIN` 和 `CO_END` 定义了协程的起点和终点。这两个标记之间的所有内容构成了协程的代码。在整个协程中可以使用普通的GML，例如修改其他实例中的变量，但为了启用协程特定的行为，必须使用特殊的协程语法。`THEN` 和 `END` 是结构命令，它们的用法类似于打开 `{` 和关闭 `}` 大括号。

`AWAIT` 和 `DELAY` 是为方便提供的命令。`AWAIT` 会在那行代码暂停协程，直到条件返回 `true`。在上面的示例中，我们正在等待用户按下空格键，然后再将过场动画推进到后续指令。`DELAY` 会等待一段时间（以毫秒为单位）再继续。

最后，我们有一个不寻常的命令 `YIELD`。这个函数是协程的核心。当协程遇到 `YIELD` 命令时，它会立即跳出协程并允许你的游戏执行其他指令。在下一步中，协程将从 `YIELD` 命令处继续执行代码。

简化过场动画处理只是一个开始：协程还可以用于UI动画、复杂的网络协议、REST API和OAuth流程、多阶段视觉效果、异步保存/加载（主机开发所需）等。它们非常有用，现在它们已经在GameMaker中实现了。

## 协程是如何执行的？
*本文档解释了协程执行的基本原理，以及如何使用函数调用生成协程。如果你想了解GML语法扩展的内部工作原理，请参见[我们如何扩展GML]*

### 执行

此库中的协程执行围绕“协程根结构”进行，这是一个数据容器，既管理协程的执行又存储协程状态（协程执行时读写的变量）。每当你为协程编写代码时，它会自动作用于协程的范围内。这意味着你可以编写代码而不必担心是否意外访问了其他地方的数据——从某种意义上说，协程中的每个变量都是局部的。根结构也是执行[协程方法](https://github.com/JujuAdams/Coroutines/wiki/Coroutine-Methods)的目标范围。

当创建一个协程时，它会在每帧处理的全局协程列表中注册。因此，协程会自动执行，无需额外的代码来运行它们。当然，你可以在任何时候使用相关方法[取消](https://github.com/JujuAdams/Coroutines/wiki/Coroutine-Methods#cancel)或[暂停](https://github.com/JujuAdams/Coroutines/wiki/Coroutine-Methods#pausereturnvalue)协程。当一个协程[完成](https://github.com/JujuAdams/Coroutines/wiki/Coroutines/wiki/Coroutine-Methods#getcomplete)时，它会从全局列表中移除，这意味着分配给它的内存将被垃圾回收，前提是你的代码没有引用它。

如上所述，协程每帧自动执行。不幸的是，GameMaker没有使这变得容易，我们实际上需要在某个实例的Step事件中挂钩，以便协程能够执行。这就是[`CoroutineEventHook()`](https://github.com/JujuAdams/Coroutines/blob/main/scripts/CoroutineEventHook/CoroutineEventHook.gml)函数的目的。请注意，此函数还包含处理异步事件的代码——同样的问题，我们需要一个实例来执行事件钩子函数，以便协程接收到任何异步事件。

### 生成

当定义一个协程时，根结构会被赋予一系列需要执行的指令。指令可以简单地是“运行这段GML代码”，也可以是流程控制（循环和分支），或者是需要根结构等待进一步输入的行为。指令通过函数调用添加到根结构中，如下所示：

```javascript
__CoroutineFunction(function() // 指令1
{
    i = 0;
});

__CoroutineWhile(function() // 指令2
{
    return (i < 6);
});

__CoroutineFunction(function() // 指令3
{
    show_debug_message("六条消息！");
    show_debug_message("(i=" + string(i) + ")");
});

__CoroutineYield(function() // 指令4
{
    return i;
});

__CoroutineEndLoop(); // 指令5

__CoroutineFunction(function() // 指令6
{
    show_debug_message("完成！");
});
```

我们称一系列添加指令到协程的函数调用为“生成器函数”。注意协程生成器函数需要一个步骤来启动while循环`__CoroutineWhile()`，并需要另一个指令来结束循环`__CoroutineEndLoop()`。这个生成器函数等价于以下标准的GML代码：

```javascript
var i = 0;
while (i < 6)
{
    show_debug_message("六条消息！");
    show_debug_message("(i=" + string(i) + ")");
    //YIELD...THEN没有等价物！
}
show_debug_message("完成！");
```

通过比较生成器函数和它的标准GML等价代码，很明显标准GML更简洁！我们通过扩展GML中的语法解决了这个问题——有关更多信息，请参见[我们如何扩展GML]。

无论如何，协程是通过这些生成器函数调用构建的。这些函数所做的只是将数据推入一个指令数组，或更改将数据推入哪个指令数组。我们首先将数据写入协程的根结构，但当进入while循环时，我们开始将数据推入while循环中。在结束while循环后，我们返回将指令推入根结构的数组。

我们可以通过将其写成嵌套数组来进行可视化（为简单起见，我在这里简化了函数调用）：

```
根 : [
    i = 0,                        指令1
    while (i < 6) : [             指令2
        "六条消息！",              指令3
        "(i=" + string(i) + ")",
        YIELD i,                  指令4
    ],                            指令5
    "完成!"                       指令6
]
```

通过将指令分解为这些嵌套数组，我们可以将我们的协程解释为一个遍历其指令数组直到执行完所有指令的机器。数组中的每个指令本身都是一个机器。无论那个内部机器需要做什么，它必须完成其任务，然后外部机器才能继续遍历其指令数组。考虑到根结构在完成其指令时会完全停止，但while循环可能执行其循环数百次，因此显然存在多种类型的机器。

这些机器并不真实，毕竟它们是[虚拟机](https://en.wikipedia.org/wiki/Virtual_machine)，这是你可能听说过的一个术语。这里描述的是一种非常简单的VM，但它仍然是一个VM。

实际上，每个[命令]都有一个对应的机器。如果你感兴趣，可以通过查看库代码中的`System`文件夹来探究控制每种机器的代码。要使用这个库，理解所有细节并不是必需的，但我认为这仍然很有趣。

协程的主要特征（不仅仅是这个库）是它们可以暂停和恢复执行。回到我们的机器比喻，每台机器都有记忆：1）是否已完成，如果没有，2）协程暂停前它在做什么。这比听起来要简单。每个协程都有一个根结构，包含所有变量，因此它会保留，而每个机器可以存储其自己的状态跟踪变量。例如，我们示例中的while循环有一个变量跟踪它在指令数组中的位置。当协程恢复时，整个协程会找到哪个内部机器仍有工作要做，并使用该机器的状态变量恢复执行。

这解释了指令如何组织和执行，但具体的代码行呢？通常，对于虚拟机，每一行代码都会被处理。这实际上就是[GameMaker的虚拟机工作方式](https://www.reddit.com/r/gamemaker/comments/9g9v2a/any_documentation_gml_bytecode_and_assembly/)，每一行代码都会被分解成一系列指令。这个库并没有做这么多的工作，因为我们可以让GameMaker为我们完成！我们可以利用GMS2.3的匿名函数特性（`function() {}`）来准备任意代码，以便在协程需要时执行。

## 我们如何扩展GML？

乍一看，向GML添加新语言特性似乎像是魔法。在编写库或者任何可互换代码时，我们通常优先考虑通过函数与系统交互。一些库鼓励你直接编辑变量，其他则使用着色器或表面来实现所需效果，许多库使用宏和枚举来表示该库特有的常量。

宏非常强大。宏实际上会直接将其值插入到代码中。通常，我们会将宏设置为一个字符串或数字，偶尔会将宏用作我们希望在多个地方使用的表达式。例如：

```
#macro ON_DIRECTX  ((os_type == os_windows) or (os_type == os_xboxone) or (os_type == os_xboxseriesxs) or (os_type == os_uwp))
```

然后，我们可以在代码库的其他地方使用`ON_DIRECTX`，根据游戏是否在DirectX平台上运行来执行不同的行为（这对于修复UV坐标的问题非常有用）。在这里，宏被用作封闭表达式——它是完全自包含的，可以在需要的地方插入而无需进一步考虑。

这个库使用了许多宏，但大多数这些宏**不是**自包含的。库中的宏会将**不完整**的表达式插入到代码中。为了生成有效的、完整的表达式，这些宏必须一起使用。乍一看这似乎是个问题，但它允许我们创建一种可以表达复杂结构的语法。

让我们来看看`CO_BEGIN`和`CO_END`是如何工作的。这两个宏在概念上是最复杂的，但理解它们的工作原理可以解释其他自定义语法宏如何配合在一起。

```javascript
#macro CO_BEGIN  ((function(){__CoroutineBegin(function(){
#macro CO_END    });return __CoroutineEnd();})());
```

这是非常复杂的代码，使用了很多嵌套，难以阅读，所以让我们在上下文中使用它来使事情变得更容易理解。

```javascript
function Example()
{
    return CO_BEGIN
        show_debug_message("What an incredible function.");
    CO_END
}
```

这段代码展开为：

```javascript
function Example()
{
    // CO_BEGIN
    return ((function(){__CoroutineBegin(function(){
    
    //我们在协程中放置的单行代码
    show_debug_message("What an incredible function.");
    
    //CO_END
    });return __CoroutineEnd();})());
}
```

你可以看到，我们使用宏在协程的内容周围插入合法的GML。让我们进一步拆解实际进行的操作。我将重写一些内容，以便更容易看出生成函数如何返回新的协程根结构体。

```javascript
function Example()
{
    var _generatorFunction = function()
    {
        //将一些代码添加到全局协程根结构体 (global.__coroutineNext) 中执行
        //在启动时创建一个全局空协程根结构体，并始终可用
        //在这个生成函数的末尾生成一个新的结构体，以便在下一个协程中使用
        __CoroutineBegin(function()
        {
            show_debug_message("What an incredible function.");
        });
        
        //返回我们刚刚添加代码的协程结构体
        return __CoroutineEnd();
    };
    
    //运行生成函数并返回其值（协程根结构体）
    return _generatorFunction();
}
```

这样，通过宏扩展，我们可以在GML中定义和使用协程。

### 宏的强大功能

使用宏的确可以做很多事情。仅通过两个简单的语句 `CO_BEGIN` 和 `CO_END`，我们就能在一个函数内部展开整个协程的功能！你会注意到，`CO_BEGIN` 以 `__CoroutineFunction(function() {` 结尾，而 `CO_END` 以 `});` 开始。这使得这两个宏能够用于将代码封装在一个函数内部。这是这个库中宏的一个重复模式：一个宏要么是开启一个新函数，要么是关闭一个函数。

让我们通过引入另外三个宏来使我们的示例更加复杂。

```javascript
#macro REPEAT  });__CoroutineRepeat(function(){return 
#macro THEN    });__CoroutineThen(function(){
#macro END     });__CoroutineEndLoop(function(){
```

接下来是协程本身的示例：

***请注意***，在这里使用 `REPEAT 5 THEN ... END` 是完全不必要的，`repeat(5) {}` 就足够了。`REPEAT`（以及 `WHILE` / `IF` / `FOREACH`）只有在循环中包含 `YIELD` 命令时才**是必需的**。我们在这里使用协程版本的循环仅作为示例。

```javascript
function Example()
{
    return CO_BEGIN
        show_debug_message("What an incredible function.");
        REPEAT 5 THEN
            show_debug_message("Wow!");
        END
    CO_END
}
```

这段代码展开为以下的生成函数：

```javascript
function Example()
{
    // CO_BEGIN
    var _generatorFunction = function()
    {
        __CoroutineBegin(function()
        {
            // 第一行代码
            show_debug_message("What an incredible function.");
        
            // REPEAT
        });
        __CoroutineRepeat(function()
        {
            return 5; // 5 来自 REPEAT 和 THEN 之间的数字
        
            // THEN
        });
        __CoroutineThen(function()
        {
            // 第二行代码
            show_debug_message("Wow!");
        
            // END
        });
        __CoroutineEndLoop(function()
        {
        
            // CO_END
        });
        
        // 返回我们刚刚添加代码的协程结构体
        return __CoroutineEnd();
    };
    
    // 运行生成函数并返回其值（协程根结构体）
    return _generatorFunction();
}
```

注意最后一个函数是空的。这个宏系统的一个特性就是这种情况很常见！

现在，应该可以清楚地看到这些宏如何作为不完整的表达式链接在一起以生成有效的GML。实际上，这些宏并没有做比其他库中的函数调用更多的事情。它们的强大之处在于如何隐藏功能组件的细节，从而使编写代码时不被屏幕上的函数调用混淆。

### 宏示例总结

宏的使用实际上是为了隐藏复杂的函数调用，使得代码更加简洁。下面是宏展开的代码：

```javascript
function Example()
{
    // CO_BEGIN
    var _generatorFunction = function()
    {
        __CoroutineBegin(function()
        {
            show_debug_message("What an incredible function.");
        });
        __CoroutineRepeat(function()
        {
            return 5; // 5 是 REPEAT 和 THEN 之间的数字
        });
        __CoroutineThen(function()
        {
            show_debug_message("Wow!");
        });
        __CoroutineEndLoop(function()
        {
        });
        return __CoroutineEnd();
    };
    
    return _generatorFunction();
}
```

通过宏，我们可以在GML中实现复杂的协程行为，而不必显式地处理大量的底层函数调用和管理代码。宏的设计使得复杂的功能变得易于使用，帮助开发者集中精力在实际的逻辑和功能实现上。
## 配置
`__CoroutinesConfig()`是一个包含少量宏的脚本，可以用来定制协程库的全局行为。如果你想改变库的默认行为，你应该编辑这些宏。

### `COROUTINES_CHECK_SYNTAX`

**预期值:** Boolean, `true` or `false`

是否对协程进行运行时语法检查。这在启动协程时有性能上的损失，但在执行协程时没有。此外，语法检查是一个实验性的功能。如果你发现语法检查器没有帮助的话，它可能会抛出假的结果。

1. [提交一个错误报告!](https://github.com/JujuAdams/Coroutines/issues) 这个问题很可能是可以解决的!
2. 将此宏设置为 `false`

此外，运行时语法检查在创建一个协程程序时有一点小的性能损失。如果你觉得你需要更多的速度，你可能想把这个宏设置为"false"来回收一点CPU时间。
&nbsp;

### `COROUTINES_DELAY_REALTIME`

**预期值:** Boolean, `true` or `false`

将此宏设置为`true`，以测量`DELAY`命令的持续时间，单位为毫秒。如果你需要每一帧的准确性，那么将这个宏设置为`false`。

&nbsp;

### `COROUTINES_DEFAULT_CANCEL_WHEN_ORPHANED`

**预期值:** Boolean, `true` or `false`

当协程的主体被销毁或被垃圾回收时，取消轮子的行为。一个特定的程序在成为孤儿时是否被取消，也可以用`.CancelWhenOrphaned()`方法来控制。

**注意：** 一个停用的实例算作一个不存在的实例。

&nbsp;

### `COROUTINES_DEFAULT_CREATOR_WEAK_REFERENCE`

**预期值:** Boolean, `true` or `false`

这个宏与上面那个宏有关。如果你在一个结构的范围内创建一个coroutine，coroutine需要保持对该结构的引用，以便`.GetCreator()`方法能够返回一个值。如果你期望（或打算）该结构在某一时刻被垃圾回收，这将导致一个问题，因为如果coroutine持有一个强引用，coroutine将保持该结构的活力。将此宏设置为"true "将默认每个结构的引用为弱引用，以避免这一问题。可以使用`.WeakReference()`方法来进一步调整单个coroutine持有的引用类型。

&nbsp;

### `COROUTINES_GAMEMAKER_BROADCASTS_TRIGGER_NATIVE`

**预期值:** Boolean, `true` or `false`

Coroutines有它自己的本地广播系统。广播可以用`CoroutineBroadcast()`函数进行，监听器可以用`AWAIT_BROADCAST`设置。GameMaker有自己的广播系统，精灵和序列可以发射事件。GameMaker的广播可以被Coroutine使用`AWAIT_ASYNC_BROADCAST`接收，并且GameMaker的全局变量`event_data`将被访问，正如你所期望的那样。Coroutine的广播和GameMaker的广播是两个不同的系统，通常不会相互影响。

有时能够使用`AWAIT_BROADCAST`来接收GameMaker的广播是很有用的。将这个宏设置为`true`将允许GameMaker广播触发本地Coroutine广播监听器。然而，如果GameMaker广播触发了一个本地监听器，那么`event_data`将不能被访问。将此宏设置为 "true "不会禁用 `AWAIT_ASYNC_BROADCAST`，所以要注意不要混淆行为。


## 协程语法
以下是用于定义coroutine的有效命令宏。请记住，每个cououtine命令宏之间的代码都在独立的GML函数中。这些函数在同一范围内执行（coroutine根结构），但由于在不同的函数中，它们不能共享局部变量（"var"变量）。

### 基础

#### `CO_BEGIN` 和 `CO_END`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("This is an example coroutine.");
CO_END
```

`CO_BEGIN`和`CO_END`被要求放在所有Coroutine代码的括号内。COROUTINE命令必须放在这两条命令中才有效（否则你可能会遇到致命的编译错误）。`CO_BEGIN`为创建的coroutine实例返回一个coroutine根结构。如果你想从coroutine中读取数值或使用方法控制其执行，那么你将需要保持对coroutine根结构的引用。

创建一个程序将自动把它添加到一个全局的程序列表中，以便每一帧都被执行。一旦该程序完成，它将被从全局执行中移除，并可用于内存回收。当然，如果你在该程序完成后还保持着对该程序的引用，那么在你持有的引用也被丢弃之前，它将不会被垃圾回收。

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("This is an example parent coroutine.");
    
    CO_BEGIN
        show_debug_message("This is an example child coroutine.");
    CO_END
CO_END
```

Coroutine定义可以相互嵌套，因此一个coroutine父级可以创建额外的coroutine子级。在一个父下创建的子将继续执行，无论父是否被暂停、取消或以其他方式进行交互。每个子程序都存在于它自己的范围内，因此每个子程序内的变量对该程序来说是唯一的。父和子不共享变量，子代程序之间也不共享变量。

子程序不会阻止父程序的执行——如果你想让子程序阻止其父程序的执行，请使用`RACE`或`SYNC`命令（或者使用`AWAIT`创建你自己的功能）。

&nbsp;

#### `THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("This will");
    THEN
    show_debug_message("be displayed");
    THEN
    show_debug_message("in the");
    THEN
    show_debug_message("same frame");
CO_END
```

```cpp
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

`THEN`本身没有特别的意义，如果在没有上下文的情况下使用，只是将代码块附加到前面的代码块的末尾。然而，`THEN`在许多地方是必需的语法，应该按照这些命令的指示来使用。

&nbsp;

#### `CO_PARAMS.<variable>`

```cpp
function ShowPopUpMessageTwice(_message)
{
    CO_PARAMS.message = _message;
    
    return CO_BEGIN
        show_message(_message);
        DELAY 1000 THEN
        show_message(_message);
    CO_END
}
```

`CO_PARAMS`允许你在定义程序之前在程序中设置变量。如果你的coroutine位于一个启动新coroutine的函数内，这对传递参数很有帮助。

&nbsp;

#### `CO_ON_COMPLETE`

```cpp
coroutineRootStruct = CO_BEGIN
    list = ds_list_create();
CO_ON_COMPLETE
    //Clean up the list to avoid a memory leak
    ds_list_destroy(list);
CO_END
```
`CO_ON_COMPLETE`增加了额外的、最终的代码，当它完成时，将由coroutine执行。`CO_ON_COMPLETE`在调用`.Restart()`方法时也将被执行。

**请注意**，`CO_ON_COMPLETE`代码的内容必须是简单的GML。这意味着你不能在代码块内使用coroutine命令。

&nbsp;

#### `CO_SCOPE = <struct/instance>`

**这是为方便而提供的高级功能，在使用时不应不加注意。**

```cpp
////Create Event of an object
//Set the scope of the next coroutine to ourselves (CO_SCOPE is reset by CO_END)
CO_SCOPE = self;
//Start 
CO_BEGIN
    WHILE true THEN //Repeat forever!
        //Randomize our position and angle
        image_angle = random(360);
        x = xprevious + random_range(-5, 5);
        y = yprevious + random_Range(-5, 5);
        
        //Wait 120ms before doing this again
        DELAY 120 THEN
    END
CO_END
////Draw Event
draw_self();
```

时不时地，让一个coroutine直接与一个实例（或结构）的状态进行交互是很有用的。`CO_PARAMS`和`.GetCreator()`是为了帮助coroutine和游戏中的其他数据容器之间顺利互动而提供的，但在特定范围内调用代码可能是有利的。

当一个协程被生成时，每个命令之间的所有代码被收集在一个本地GameMaker函数中。这个函数的范围，默认情况下，被强制为根coroutine结构。这确保了实例变量总是在一个隔离的环境中被创建和修改。虽然这比其他方法要安全得多，但也会有不便之处。`CO_SCOPE`覆盖了默认的行为（范围为coroutine结构），这样函数的范围为你选择的实例或结构。

然而，coroutine结构仍然被生成，并将作为调用coroutine方法的端点而存在。所有的程序方法仍然可以通过直接引用由`CO_BEGIN`返回的程序结构来访问。

`CO_SCOPE`适用于下一个程序定义，并且只适用于下一个定义。当`CO_END`被调用时，`CO_SCOPE`将被重置为默认行为（范围为根冠状结构）。在这方面，`CO_SCOPE`类似于`CO_PARAMS`。

**请注意**，通过使用`CO_SCOPE`，很容易产生冲突，即两个coroutine争相为一个实例设置相同的值。这可能会导致令人不快和棘手的bug的修复。**使用该功能的风险由你自己承担**。

&nbsp;

#### `CO_LOCAL.<variable>`

```cpp
CO_PARAMS.cells_to_travel = 10;
CO_SCOPE = self;
CO_BEGIN
    CO_LOCAL.i = 0; //Use a coroutine variable to count how many times we've moved
    WHILE CO_LOCAL.i < CO_LOCAL.cells_to_travel THEN
	    
        //Move down the grid, 32px at a time
        y += 32; 
        
        //Change our sprite
        sprite_index = sprMoveDown;
        
        //Wait 90ms before doing this again
        DELAY 90 THEN
    END
CO_END
```

`CO_LOCAL`包含一个对当前正在处理的循环程序的引用。默认情况下，`CO_LOCAL`将是coroutine代码块内部的`self`作用域。如果你使用`CO_SCOPE`（见上文），情况就会改变，因为现在的coroutine代码块是在其他实例/结构的范围内运行。为了能够引用由coroutine根结构持有的沙盒变量，需要`CO_LOCAL`。

&nbsp;

&nbsp;

### 返回值

#### `YIELD <expression> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("This will");
    YIELD THEN
    show_debug_message("be displayed");
    YIELD THEN
    show_debug_message("over several");
    YIELD THEN
    show_debug_message("different frames");
CO_END
```

```cpp
coroutineRootStruct = CO_BEGIN
    i = 1;
    REPEAT 5 THEN
        YIELD i THEN //Yield the values 1, 2, 4, 8, 16 over 5 frames
        i *= 2
    END
CO_END
```


`YIELD`指示协程程序暂时停止执行协程程序并返回一个值。与`PAUSE...THEN`或`RETURN`不同，执行将在下一帧恢复，不需要任何其他动作。由`YIELD`发出的值可以使用`.Get()`方法从coroutine中读取。如果在`YIELD`和`THEN`之间没有指定值，那么`.Get()`将返回`undefined`。

**请注意**，`YIELD`命令后面必须有`THEN`命令。如果你忘记了`THEN`命令，那么代码将神秘地不能运行，并且会出现"跳过"。

&nbsp;

#### `PAUSE <expression> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("Look left");
    PAUSE "left" THEN
    show_debug_message("Look right");
    PAUSE "right" THEN
    show_debug_message("Look left again");
    PAUSE "left" THEN
    show_debug_message("Then cross the road");
CO_END
```
`PAUSE`指示coroutine立即暂停执行并返回一个值。这与`YIELD`的行为类似，但与`YIELD`不同的是，一个暂停的coroutine**不会**在下一帧恢复执行。你将需要调用`.Resume()`方法来恢复暂停的 coroutine 的执行。由`PAUSE`发出的值可以使用`.Get()`方法从该协程程序中读取。如果在`PAUSE`和`THEN`之间没有指定值，那么`.Get()`将返回`undefined`。

**请注意**，`PAUSE`命令后面必须有`THEN`命令。如果你忘记了`THEN`命令，那么代码将神秘地不能运行，并出现"跳过"。

&nbsp;

#### `RETURN <expression>`

```cpp
coroutineRootStruct = CO_BEGIN
    IF oPlayer.x > 55 THEN
        RETURN "Too far right"
    ELSE
        CutsceneFindMyFroggy();
        RETURN "Playing cutscene"
    END_IF
CO_END
```


`RETURN`指示coroutine立即完成执行并返回给定值。与`YIELD`或`PAUSE`不同的是，该程序的执行被完全停止（尽管该程序可以通过`.Restart()`方法重新启动）。由`RETURN`发出的值可以用`.Get()`方法从该协程程序中读取。如果在`RETURN`后没有指定任何值，那么`.Get()`将返回`undefined`。

**请注意**，`RETURN`命令后面不需要有`THEN`命令。任何写在`RETURN`命令后面的东西当然不会被执行，就像GML的本地`return`命令。

&nbsp;

#### `RESTART`

```cpp
coroutineRootStruct = CO_BEGIN
    CreateSmokeParticle(oChimney.x, oChimney.y);
    DELAY random_range(300, 350) THEN
    RESTART
CO_END
```

`RESTART`指示异步协程产生，然后在下一个异步协程框架中，restart执行。如果调用coroutine结构上的`.Get()`方法，一个被重新启动的coroutine将返回`undefined`。通过将`RESTART`放在一个循环程序的末尾，你可以让一个循环程序无休止地循环，直到被cancel。`CO_ON_COMPLETE`将在重新启动一个循环程序时被调用。

**请注意，循环程序中的变量不会被重置。**

**请注意**，`RESTART`命令后面不需要有`THEN`命令。任何写在`RESTART`命令后面的东西都不会被执行，就像GML的本地`return`命令。

&nbsp;

&nbsp;

### 循环

#### `END`

```cpp
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

它本身没有任何作用。然而，`END`对于终止`REPEAT`、`WHILE`或`FOREACH`循环是必要的。它也应该被用来终止`RACE`或`SYNC`块。在其他情况下，不能使用它。

&nbsp;

#### `REPEAT <expression> THEN <function> END`

```cpp
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

类似于GameMaker自己的`repeat()`循环。没有必要在**所有的情况**下使用这个宏来取代标准的`repeat()`循环。只有当`repeat()`循环包含一个coroutine命令时，才**需要**使用`REPEAT...END`循环。

&nbsp;

#### `WHILE <condition> THEN <function> END`

```cpp
coroutineRootStruct = CO_BEGIN
    fireball = instance_create_depth(oPlayer.x, oPlayer.y, 0, oFireball);
    
    //Wait until the fireball has risen above the player by 30 pixels
    WHILE fireball.y <= fireball.ystart - 30 THEN
        fireball.y -= 5;
        YIELD THEN
    END
    
    //Then shoot the fireball at the nearest enemy!
    nearest = instance_nearest(fireball.x, fireball.ystart, oEnemy);
    fireball.direction = point_direction(fireball.x, fireball.y, nearest.x, nearest.y);
    fireball.speed = 11;
CO_END
```

`WHILE`类似于GameMaker自己的`while()`循环。没有必要在**所有的情况**下使用这个宏来取代标准的`while()`循环。只有当`while()`循环包含一个coroutine命令时，才**需要**使用`WHILE...END`循环。

&nbsp;

#### `FOREACH <iteratorVariable> IN <iterableData> THEN <function> END`

```GML
coroutineRootStruct = CO_BEGIN
    highestHP = 0;
    highestInstance = noone;
    
    //Find the enemy from our array with the highest HP
    FOREACH instance IN global.arrayOfEnemies THEN
        if (instance.hp > highestHP)
        {
            highestHP = instance.hp;
            highestInstance = instance;
        }
    END
    
    //Bash them!
    if (instance_exists(lowestInstance)) hp -= 100;
CO_END
```
`FOREACH...THEN`循环是一个方便的功能，它在以下两种情况下进行迭代
1) 一个数组。
2) 一个结构。
3) 一个对象的实例。
4) 或从一个循环程序输出的`YIELD'。

当在数组上迭代时，迭代器变量是由数组本身给出的值。当迭代结构时，迭代器变量从结构中获得数值；要迭代结构的键，请使用[`variable_struct_get_names()`](https://manual.yoyogames.com/GameMaker_Language/GML_Reference/Variable_Functions/variable_struct_get_names.htm)。

当迭代对象的实例时，迭代器变量被赋予实例引用（实例的结构表示，例如，在实例的范围内调用`self'得到的）。**请注意**，"FOREACH "循环的行为与GameMaker的本地 "with() "循环不同："FOREACH "循环中的代码范围不会改变。

当迭代一个循环的输出时，`YIELD`值被分配给迭代器变量。`FOREACH...THEN`循环将在可迭代的循环程序完成时终止。

**请注意**不要修改你正在迭代的数组或结构。当`FOREACH...THEN`循环开始时，迭代的总数被计算出来，如果数组或结构的大小发生变化，则可能导致崩溃和其他错误。

&nbsp;

#### `BREAK`

```cpp
coroutineRootStruct = CO_BEGIN
    healthRemaining = oPlayer.hp;
    FOREACH heart IN global.heartInstances THEN
        heart.sprite_index = min(4, healthRemaining);
        healthRemaining -= 4;
        if (healthRemaining <= 0) BREAK;
    END
CO_END
```
类似于GameMaker自己的`break`命令。立即脱离`REPEAT...THEN`、`WHILE...THEN`或`FOREACH...THEN`循环，不执行循环中的其他代码。循环中的其余代码将正常执行。

**请注意**，标准的GML `break` 命令不会在coroutine循环中发挥作用。

&nbsp;

#### `CONTINUE`

```cpp
coroutineRootStruct = CO_BEGIN
    FOREACH enemy IN objEnemy THEN
        IF point_distance(oPlayer.x, oPlayer.y, enemy.x, enemy.y) > 100 THEN
            CONTINUE
        END_IF
        
        enemy.vspeed -= 4;
    END
CO_END
```
类似于GameMaker自己的`continue`命令。强制执行一个循环（无论是 `REPEAT...THEN`，`WHILE...THEN`，还是 `FOREACH...THEN` 循环），立即进入下一个迭代，而不执行循环中的其他代码。

**请注意**，标准的GML`continue`命令在coroutine循环中不起作用。

&nbsp;

&nbsp;

### 分支

#### `IF <condition> THEN <function> END_IF` (and `ELSE` and `ELSE_IF`)

```cpp
coroutineRootStruct = CO_BEGIN
    healthRemaining = oPlayer.hp;
    
    FOREACH heart IN global.heartInstances THEN
        heart.sprite_index = min(4, healthRemaining);
        healthRemaining -= 4;
        
        IF (healthRemaining <= 0) THEN
            BREAK;
        END_IF
        
        YIELD THEN
    END
CO_END
```

类似于GameMaker自己的`if`和`else`命令。一个IF必须由一个`END_IF`来匹配。通常不需要使用这些特定的命令。如果if-else（或else-else等）本身包含一个coroutine命令，你应该使用这些宏，但`ASYNC_COMPLETE`除外。`ELSE`和`ELSE_IF`也被支持。

**请注意**，`ELSE IF`是不正确的语法，会导致编译错误，请确保使用`ELSE_IF`。

&nbsp;

### 其他

#### `DELAY <expression> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    WHILE instance_exists(oRainbow) THEN
        oRainbow.image_blend = c_red;
        DELAY 500 THEN
        oRainbow.image_blend = c_orange;
        DELAY 500 THEN
        oRainbow.image_blend = c_yellow;
        DELAY 500 THEN
        oRainbow.image_blend = c_lime;
        DELAY 500 THEN
        oRainbow.image_blend = c_aqua;
        DELAY 500 THEN
        oRainbow.image_blend = c_purple;
        DELAY 500 THEN
    END
CO_END
```
`DELAY`是一个方便的行为，它将暂停一个循环程序的实际时间量。延迟的时间是以毫秒为单位的；一秒钟是1000毫秒，在60FPS下，一个单帧是（大约）16.66ms。

**请注意**，当一个程序在等待`DELAY`命令时，`.GetPaused()`方法将**不会**返回"true"。

&nbsp;

#### `AWAIT <condition> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    fireball = instance_create_depth(oPlayer.x, oPlayer.y, 0, oFireball);
    fireball.hspeed = -5;
    
    //Wait until the fireball has risen above the player by 30 pixels
    AWAIT fireball.y <= fireball.ystart - 30 THEN
    
    //Then shoot the fireball at the nearest enemy!
    nearest = instance_nearest(fireball.x, fireball.ystart, oEnemy);
    fireball.direction = point_direction(fireball.x, fireball.y, nearest.x, nearest.y);
    fireball.speed = 11;
CO_END
```
`AWAIT`是一个方便的行为，它在继续执行代码之前会检查其条件。如果条件返回 `true`，那么将立即继续执行。然而，如果条件返回 "false"，那么coroutine将暂时停止执行，直到下一帧（很像`YIELD...THEN`，尽管`AWAIT`将产生一个 "undefined "值）。

**请注意**，当一个coroutine在等待`AWAIT`命令时，`.GetPaused()`方法将**不会**返回`true`。

&nbsp;

#### `AWAIT_FIRST <coroutine> ... END`

```cpp
coroutineRootStruct = CO_BEGIN
    AWAIT_FIRST
        CO_BEGIN
            DELAY 200 THEN
            show_debug_message("First coroutine finished");
        CO_END
        
        CO_BEGIN
            DELAY 100 THEN
            show_debug_message("Second coroutine finished");
        CO_END
    END
    
    show_debug_message("Race finished (second coroutine should finish first)");
CO_END
```

`AWAIT_FIRST`允许父程序暂时停止执行，直到定义的子程序中的一个完成。一旦任何一个子程序完成执行，父程序的执行将继续；其余未完成的子程序将立即被取消。只有在`AWAIT_FIRST...END`块中定义的程序才会被考虑到这种行为，任何先前创建的子程序将被忽略，以达到`AWAIT_FIRST`逻辑的目的。

每个子程序都存在于它自己的范围内，因此每个子程序内的变量对该程序来说是唯一的。父级和子级程序不共享变量，子级程序之间也不共享变量。所有角逐程序将执行`CO_ON_COMPLETE`函数，无论该角逐程序是否是第一个结束的。

**请注意**与普通的子程序不同，暂停或取消父程序将暂停或取消在`AWAIT_FIRST...END`块内创建的子程序。

**请注意**当一个协程在`AWAIT_FIRST`命令下等待时，`.GetPaused()`方法**不会**返回`true`。

&nbsp;

#### `AWAIT_ALL <coroutine> ... END`

```cpp
coroutineRootStruct = CO_BEGIN
    AWAIT_ALL
        CO_BEGIN
            DELAY 200 THEN
            show_debug_message("First coroutine finished");
        CO_END
        
        CO_BEGIN
            DELAY 100 THEN
            show_debug_message("Second coroutine finished");
        CO_END
    END
    
    show_debug_message("Sync finished (both coroutines should have finished)");
CO_END
```
`AWAIT_ALL`允许一个父程序暂时停止执行，直到所有定义的子程序完成。一旦所有的子程序完成了执行，父程序的执行将继续进行。只有在`AWAIT_ALL...END`块内定义的程序才会被考虑，任何先前创建的子程序将被忽略，以用于`AWAIT_ALL`逻辑。

每个子程序都存在于它自己的范围内，因此每个子程序中的变量对该程序来说是唯一的。父类和子类程序不共享变量，子类程序之间也不共享变量。

**请注意**与普通的子程序不同，暂停或取消父程序将暂停或取消在`AWAIT_ALL...END`块中创建的子程序。

**请注意**，当一个协程在`AWAIT_ALL`命令下等待时，`.GetPaused()`方法将不会**返回`true'。

&nbsp;

#### `AWAIT_BROADCAST <name> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    //Rotate the door 30 degrees so it's ajar
    WHILE image_angle < 30 THEN
        image_angle += 5
        YIELD
    END
    
    //Wait for the player to push right...
    AWAIT_BROADCAST "push right" THEN
    
    //...then open the door all the way!
    WHILE image_angle <= 90 THEN
        image_angle = min(90, image_angle + 5);
        YIELD
    END
CO_END

///Elsewhere in the player object...
if (keyboard_check(vk_right))
{
    CoroutineBroadcast("push right");
    hspeed = 2;
}
```


`AWAIT_BROADCAST`是一个有用的命令，它允许间接的，对 coroutine 的控制。当coroutine遇到`AWAIT_BROADCAST`命令时，coroutine将在该命令处暂停。为了使该程序继续执行，必须使用与`AWAIT_BROADCAST`命令相同的名称调用`CoroutineBroadcast()`。然后，当`CoroutineEventHook()`在一个Step事件中被调用时（通常是在下一帧），该程序将继续执行。如果多个程序在等待同名的广播，只需要调用一次`CoroutineBroadcast()`就可以恢复所有这些程序。

**请注意**，当一个协程在等待`AWAIT_BROADCAST`命令时，`.GetPaused()`方法将**不会**返回`true`。

`AWAIT_BROADCAST`默认情况下，只响应本地Coroutines广播。要收听来自精灵和序列的GameMaker广播，请使用`AWAIT_ASYNC_BROADCAST`。

&nbsp;

&nbsp;

### 异步事件

#### `AWAIT_ASYNC_* <function> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("Starting leaderboard pull");
    handle = steam_download_scores("Game Scores", 1, 10);
    
    AWAIT_ASYNC_STEAM
        if (async_load < 0)
        {
            show_debug_message("Leaderboard request timed out");
        }
        else if (async_load[? "id"] == handle)
        {
           show_debug_message("Leaderboard data received");
            global.scores = array_resize(0);
            
            var _list = map[? "entries"];
            var _i = 0;
            repeat(ds_list_size(_list))
            {
                var _data = _list[| _i];
                array_push(global.scores, {name : _data[? "name"], score : _data[? "score"], rank : _data[? "rank"]});
                _i++;
            }
            
            ASYNC_COMPLETE
        }
    THEN
    
    show_debug_message("Leaderboard pull complete");
CO_END
```


`AWAIT_ASYNC_*`命令（完整列表见下文）允许一个coroutine与GameMaker的本地异步事件系统进行交互。当coroutine遇到`AWAIT_ASYNC_*`命令时，coroutine将暂停该行代码并等待相关的异步事件被触发。一旦GameMaker的运行时出现正确类型的异步事件，`AWAIT_ASYNC_* ... THEN`的异步代码将被执行。如果该代码块调用了`ASYNC_COMPLETE`，那么coroutine立即执行进一步的代码，否则`AWAIT_ASYNC_*`继续监听新的事件。

位于`AWAIT_ASYNC_*`和`THEN`之间的标准GML函数在每次触发异步事件时都会被执行，而不管该异步事件是否与coroutine有关。这很不幸，但这也是GameMaker的设计方式。你应该总是检查你收到的`async_load`或`event_data` ds_map是否与你所期望的异步事件相匹配。

`AWAIT_ASYNC_*`命令后面的代码不能包含任何coroutine宏（除了`ASYNC_COMPLETE`之外）。这是因为`async_load`和`event_data`可能包含易失性数据，在异步事件结束后不会持久。如果你想对异步事件返回的数据进行广泛的操作，你应该对其进行拷贝，然后在`AWAIT_ASYNC_*`代码块之外处理这些数据。

`AWAIT_ASYNC_*`代码可以在一个操作超时时执行。默认情况下，没有设置超时时间，操作可能永远挂起。你可以使用`ASYNC_TIMEOUT`宏来定制超时时间（见下文）。当一个异步操作超时时，async_load是一个负数。你应该总是写代码来检查一个异步操作是否超时，也就是说，你应该总是处理`async_load`或`event_data`为负数的情况。

请注意，`AWAIT_ASYNC_BROADCAST`会专门接收GameMaker的精灵和序列广播；它不会接收Coroutines库中的广播（使用`AWAIT_BROADCAST`来代替）。此外，在`AWAIT_ASYNC_BROADCAST`代码块中，你应该检查`event_data`而不是`async_load`。

支持以下异步等待命令：
- `AWAIT_ASYNC_HTTP`
- `AWAIT_ASYNC_NETWORKING`
- `AWAIT_ASYNC_SOCIAL`
- `AWAIT_ASYNC_SAVE_LOAD`
- `AWAIT_ASYNC_DIALOG`
- `AWAIT_ASYNC_SYSTEM`
- `AWAIT_ASYNC_STEAM`
- `AWAIT_ASYNC_BROADCAST`

这些是GameMaker中最常见的异步事件。如果你想添加更多的异步事件，那么请[让我知道](https://github.com/JujuAdams/Coroutines/issues)，它们将被纳入正式发布。

&nbsp;

#### `ASYNC_COMPLETE`

```cpp
coroutineRootStruct = CO_BEGIN
    handle = get_string_async("Please enter your name", "Juju Adams");
    result = "";    
    AWAIT_ASYNC_DIALOG
        if (async_load[? "id"] == handle)
        {
            if (async_load[? "status"]) result = async_load[? "string"];
            ASYNC_COMPLETE
        }
    THEN
    
    RETURN result;
CO_END
```
`ASYNC_COMPLETE`是`AWAIT_ASYNC_*`命令的一个重要组成部分。它表示异步操作已经完成，并且coroutine应该可以继续执行代码。如果你不在你的异步代码块中调用`ASYNC_COMPLETE`，那么异步操作可能会无限期地挂起。

**请注意**，`ASYNC_COMPLETE`不应该在`AWAIT_ASYNC_*`代码块之外调用，否则你会看到不可预测的行为。

&nbsp;

#### `AWAIT_ASYNC_* <function> ASYNC_TIMEOUT <duration> THEN`

```cpp
coroutineRootStruct = CO_BEGIN
    show_debug_message("HTTP GET started");
    handle = http_get("https://www.jujuadams.com/");
    AWAIT_ASYNC_HTTP
        if (async_load < 0) //Handle the timeout case
        {
            show_debug_message("HTTP GET timed out");
            ASYNC_COMPLETE
        }
        if (async_load[? "id"] == handle)
        {
            if (async_load[? "status"] == 0)
            {
                show_debug_message("HTTP GET succeeded");
                show_debug_message(async_load[? "result"]);
                ASYNC_COMPLETE
            }
            else if (async_load[? "status"] < 0)
            {
                show_debug_message("HTTP GET failed with error code " + string(async_load[? "http_status"]));
                ASYNC_COMPLETE
            }
        }
    ASYNC_TIMEOUT 6000 THEN //Wait 6 seconds before timing out (6000 milliseconds)
    show_debug_message("HTTP GET complete");
CO_END
```
异步操作，特别是对服务器的操作，经常会遇到问题，请求超时。`ASYNC_TIMEOUT...THEN`为`AWAIT_ASYNC_*`命令增加了一个超时行为，以处理可能出现未报告失败的情况。默认情况下，`AWAIT_ASYNC_*`命令没有超时时间，操作有可能会永远挂起。超时持续时间（`ASYNC_TIMEOUT`和`THEN`之间的数字）是以毫秒为单位的。

当异步代码被执行但操作超时时，`async_load`将被设置为一个负数。你应该总是在你的`AWAIT_ASYNC_*`块中写入行为，以处理`async_load`为负数的情况，避免出现意外问题。
