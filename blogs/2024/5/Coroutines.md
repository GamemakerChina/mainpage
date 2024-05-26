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
### 协程可以在哪些平台上运行？

理论上支持除了HTML5之外的一切。到目前为止，我只在Windows上进行了测试。整个扩展都是原生GML编写的，所以它应该可以开箱即用。您可能会在某个不经常测试的平台上遇到特殊的错误。如果你发现了他们，请[报告](https://github.com/JujuAdams/Coroutines/issues)给我们。

### 此代码库的许可证是什么？我可以将其用于商业项目吗？

该库在[MIT许可](https://github.com/JujuAdams/Coroutines/blob/master/LICENSE)下发布。这意味着您可以将其用于任何您想要的目的，包括商业项目。你可以把我的名字放在你的感谢列表（Juju Adams）并且说谢谢，这对我来说意义重大，但你没有义务这样做。

### 我认为您缺少一个有用的功能，我希望您实现它！

很好！请提出[Issues](https://github.com/JujuAdams/Coroutines/issues)。Issues使协程的使用更有趣。而且这可以让我在公共交通上感到无聊时思考一些事情。

### 我发现了一个错误，解决问题的最佳方法是什么？

请提出[Issues](https://github.com/JujuAdams/Coroutines/issues)。Juju 每天都会检查 GitHub，错误修复通常会在几天后发布。你也可以去[Discord服务器](https://discord.gg/8krYCqr)上找我，但这并不能替代一个很好的清晰的错误报告。

### 帮我！我收到有关异步事件的编译错误。
由于 GMS2.3.6 更改了一些与异步事件相关的常量名称，低于 v2.3.6 的 GameMaker 版本将不可以编译此库。您可以通过在 GM 的文档中找到旧名称并将其插入自己的项目来解决此问题。

### 协程是否适用于[GMLive](https://yellowafterlife.itch.io/gamemaker-live)？
我不知道。

### 说到GMLive，其作者还通过GMEdit实现了协程。这个库有什么不同？
Vadim早在GameMaker Studio 2.3将匿名函数引入GML之前就编写了他的协程实现。这是一个非常聪明的技术解决方案，可以解决旧版GM中许多缺失的功能。 幸运的是，GameMaker现在更加灵活，这个库主要利用了新功能来实现协程。

### 谁写的代码？
这个库是由[@jujuadams](https://twitter.com/jujuadams)经过长时间修补GameMaker而建立和维护的。Juju参与了很多[商业GameMaker游戏](http://www.jujuadams.com/)。

### 我可以给你捐款吗？
谢谢你想表达你的感激之情，这对我个人来说确实意义重大——但我很幸运的能从Gamedev中获得稳定的收入。如果你想支持我的工作，请在你的游戏里给我一个名字就够了。

## 协程简介
当你写代码并运行你的游戏时，你写的代码是按顺序执行的，一个命令在前一个命令完成后立即执行。我们将代码存储在函数中，目的是让程序从一个函数进入下一个函数，使游戏运行。当程序进入一个函数时，它必须完成整个函数（或至少到 `return` 命令为止），然后程序才能退出函数并运行其他代码。这被称为“同步执行”，这就是GameMaker的工作方式——代码是同步运行的，一行接一行，每帧数千行代码分布在数百个函数中。

异步函数的操作方式则不同。异步函数**不需要**完全完成所有的代码，程序就可以离开该函数，做其他事情，关键是，异步函数可以从他们离开的地方恢复，从他们暂停的地方恢复执行。这意味着你可以写一些代码在它的中间，以允许总体程序去做其他事情，并在稍后返回到该函数。

这个库允许你在GameMaker中编写可暂停的函数。这些可暂停的函数被称为 "coroutines"：一个代码块，可以在执行过程中暂停，稍后再继续。

许多语言原生支持编写异步代码，要么是作为核心语言功能，要么是实现异步执行的库。GML则是后者。因此，我们有必要开发自己的系统，以模拟那些支持异步函数的语言的特征和行为。从纯函数中构建corountines是笨拙的，难以遵循的，所以这个库扩展了GML的语法，这样我们就可以用更优雅的方式来描述coroutines。
### 案例
让我们看一个简单的例子：过场动画。

场景动画是一场噩梦，多年来人们花了很多精力为场景问题设计和建立不同的解决方案。最常见的解决方案是使用一个大的switch...case语句来控制什么实例做什么，什么时候做。构建这些系统是非常耗时的，而且它们最后总是很难看，不实用。在现实中，我们想要的切入函数是一个异步函数——一个可暂停的函数，它可以向游戏传递指令，使物体产生动画并显示文本，而该函数不会阻止游戏的其余部分运行。

下面是一个场景动画的例子。我们将在后面详细介绍正在发生的事情，但这应该能让你体会到用协程可以实现什么样的事情。

```gml
function CutsceneFindMyFroggy()
{
	return CO_BEGIN
		//阻止玩家使用正常的控制手段进行移动
		oPlayer.inCutscene = true;
		
		//让玩家走进房间
		WHILE (oPlayer.x != 55) THEN
			oPlayer.x = min(oPlayer.x + 2, 55);
			YIELD THEN
		END
		
		//显示一些对话
		oTextbox.text = "我的青蛙在哪里?";
		oTextbox.expression = sPlayerSad;
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		oTextbox.text = "...";
		
		//为达到喜剧效果而短暂停顿片刻
		DELAY 350 THEN //毫秒
		
		oTextbox.text = "Ribbit!";
		oTextbox.expression = sFrog;
		audio_play_sound(sndLonelyRibbit, 1, false);
		
		//让青蛙跳到玩家的怀里
		WHILE (oFrog.x != 55) THEN
			oFrog.x = max(oFrog.x - 2, 55);
			YIELD THEN
		END
		
		oTextbox.text = "啊，她来了！我美丽的两栖动物?";
		oTextbox.expression = sPlayerHappy;
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		oTextbox.text = "Ribbit! :)";
		oTextbox.expression = sFrog;
		audio_play_sound(sndHappyRibbit, 1, false);
		AWAIT keyboard_check_pressed(vk_space) THEN
		
		//清空文本框，然后释放玩家
		oTextbox.text = "";
		player.inCutscene = false;
	CO_END
}
```
这种语法与普通的GML有些不同。特别值得注意的是，它使用了新的流程控制关键字。毫无疑问，`WHILE`你已经见过了（尽管是小写的`while`循环命令），而许多其他的命令是新的或不熟悉的。

`CO_BEGIN`和`CO_END`定义了循环程序的开始和结束点。这两个标记之间的一切都构成了协程的代码。普通的GML可以在整个协程中使用，比如修改其他实例中的变量，但是为了实现协程的特定行为，必须使用特殊的协程语法。`THEN`和`END`是结构性命令，在使用上类似于打开`{`和关闭`}`的大括号。

`AWAIT`和`DELAY`是为了方便而提供的命令。`AWAIT`将暂停该行代码的循环程序，直到条件返回`true`。在上面的例子中，我们在等待用户按下空格键，然后再推进到后面的指令。`DELAY`将等待一定的时间后再继续进行（以毫秒为单位）。

最后，我们有一个不寻常的命令`YIELD`。这个功能是循环程序的核心。当一个协程碰到`YIELD`命令时，它会立即跳出协程，允许你的游戏执行其他指令。在下一步中，该程序将从`YIELD`命令中恢复，继续执行代码。

让剪辑变得更容易处理只是一个开始：协程可用于UI动画、复杂的网络协议、REST API和OAuth流程、多阶段视觉效果、异步保存/加载（控制台开发需要），还有更多。它们是非常有用的，现在它们在GameMaker中出现了。

## 配置
`__CoroutinesConfig()`是一个包含少量宏的脚本，可以用来定制协程库的全局行为。如果你想改变库的默认行为，你应该编辑这些宏。

### `COROUTINES_CHECK_SYNTAX`

**预期值:** Boolean, `true` or `false`

是否对协程进行运行时语法检查。这在启动协程时有性能上的损失，但在执行协程时没有。此外，语法检查是一个实验性的功能。如果你发现语法检查器没有帮助的话，它可能会抛出假的结果。

1. [提交一个错误报告!](https://github.com/JujuAdams/Coroutines/issues) 这个问题很可能是可以解决的!
2. 将此宏设置为 `false`

此外，运行时语法检查在创建一个协程程序时有一点小的性能损失。如果你觉得你需要更多的速度，你可能想把这个宏设置为"false"来回收一点CPU时间。


### `COROUTINES_DELAY_REALTIME`

**预期值:** Boolean, `true` or `false`

将此宏设置为`true`，以测量`DELAY`命令的持续时间，单位为毫秒。如果你需要每一帧的准确性，那么将这个宏设置为`false`。



### `COROUTINES_DEFAULT_CANCEL_WHEN_ORPHANED`

**预期值:** Boolean, `true` or `false`

当协程的主体被销毁或被垃圾回收时，取消轮子的行为。一个特定的程序在成为孤儿时是否被取消，也可以用`.CancelWhenOrphaned()`方法来控制。

**注意：** 一个停用的实例算作一个不存在的实例。



### `COROUTINES_DEFAULT_CREATOR_WEAK_REFERENCE`

**预期值:** Boolean, `true` or `false`

这个宏与上面那个宏有关。如果你在一个结构的范围内创建一个coroutine，coroutine需要保持对该结构的引用，以便`.GetCreator()`方法能够返回一个值。如果你期望（或打算）该结构在某一时刻被垃圾回收，这将导致一个问题，因为如果coroutine持有一个强引用，coroutine将保持该结构的活力。将此宏设置为"true "将默认每个结构的引用为弱引用，以避免这一问题。可以使用`.WeakReference()`方法来进一步调整单个coroutine持有的引用类型。



### `COROUTINES_GAMEMAKER_BROADCASTS_TRIGGER_NATIVE`

**预期值:** Boolean, `true` or `false`

Coroutines有它自己的本地广播系统。广播可以用`CoroutineBroadcast()`函数进行，监听器可以用`AWAIT_BROADCAST`设置。GameMaker有自己的广播系统，精灵和序列可以发射事件。GameMaker的广播可以被Coroutine使用`AWAIT_ASYNC_BROADCAST`接收，并且GameMaker的全局变量`event_data`将被访问，正如你所期望的那样。Coroutine的广播和GameMaker的广播是两个不同的系统，通常不会相互影响。

有时能够使用`AWAIT_BROADCAST`来接收GameMaker的广播是很有用的。将这个宏设置为`true`将允许GameMaker广播触发本地Coroutine广播监听器。然而，如果GameMaker广播触发了一个本地监听器，那么`event_data`将不能被访问。将此宏设置为 "true "不会禁用 `AWAIT_ASYNC_BROADCAST`，所以要注意不要混淆行为。


## 协程语法
以下是用于定义coroutine的有效命令宏。请记住，每个cououtine命令宏之间的代码都在独立的GML函数中。这些函数在同一范围内执行（coroutine根结构），但由于在不同的函数中，它们不能共享局部变量（"var"变量）。

### 基础

#### `CO_BEGIN` 和 `CO_END`

```gml
coroutineRootStruct = CO_BEGIN
    show_debug_message("This is an example coroutine.");
CO_END
```

`CO_BEGIN`和`CO_END`被要求放在所有Coroutine代码的括号内。COROUTINE命令必须放在这两条命令中才有效（否则你可能会遇到致命的编译错误）。`CO_BEGIN`为创建的coroutine实例返回一个coroutine根结构。如果你想从coroutine中读取数值或使用方法控制其执行，那么你将需要保持对coroutine根结构的引用。

创建一个程序将自动把它添加到一个全局的程序列表中，以便每一帧都被执行。一旦该程序完成，它将被从全局执行中移除，并可用于内存回收。当然，如果你在该程序完成后还保持着对该程序的引用，那么在你持有的引用也被丢弃之前，它将不会被垃圾回收。

```gml
coroutineRootStruct = CO_BEGIN
    show_debug_message("This is an example parent coroutine.");
    
    CO_BEGIN
        show_debug_message("This is an example child coroutine.");
    CO_END
CO_END
```

Coroutine定义可以相互嵌套，因此一个coroutine父级可以创建额外的coroutine子级。在一个父下创建的子将继续执行，无论父是否被暂停、取消或以其他方式进行交互。每个子程序都存在于它自己的范围内，因此每个子程序内的变量对该程序来说是唯一的。父和子不共享变量，子代程序之间也不共享变量。

子程序不会阻止父程序的执行——如果你想让子程序阻止其父程序的执行，请使用`RACE`或`SYNC`命令（或者使用`AWAIT`创建你自己的功能）。



#### `THEN`

```gml
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

```gml
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

`THEN`本身没有特别的意义，如果在没有上下文的情况下使用，只是将代码块附加到前面的代码块的末尾。然而，`THEN`在许多地方是必需的语法，应该按照这些命令的指示来使用。



#### `CO_PARAMS.<variable>`

```gml
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



#### `CO_ON_COMPLETE`

```gml
coroutineRootStruct = CO_BEGIN
    list = ds_list_create();
CO_ON_COMPLETE
    //Clean up the list to avoid a memory leak
    ds_list_destroy(list);
CO_END
```
`CO_ON_COMPLETE`增加了额外的、最终的代码，当它完成时，将由coroutine执行。`CO_ON_COMPLETE`在调用`.Restart()`方法时也将被执行。

**请注意**，`CO_ON_COMPLETE`代码的内容必须是简单的GML。这意味着你不能在代码块内使用coroutine命令。



#### `CO_SCOPE = <struct/instance>`

**这是为方便而提供的高级功能，在使用时不应不加注意。**

```gml
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



#### `CO_LOCAL.<variable>`

```gml
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





### 返回值

#### `YIELD <expression> THEN`

```gml
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

```gml
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

#### `PAUSE <expression> THEN`

```gml
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



#### `RETURN <expression>`

```gml
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



#### `RESTART`

```gml
coroutineRootStruct = CO_BEGIN
    CreateSmokeParticle(oChimney.x, oChimney.y);
    DELAY random_range(300, 350) THEN
    RESTART
CO_END
```

`RESTART`指示异步协程产生，然后在下一个异步协程框架中，restart执行。如果调用coroutine结构上的`.Get()`方法，一个被重新启动的coroutine将返回`undefined`。通过将`RESTART`放在一个循环程序的末尾，你可以让一个循环程序无休止地循环，直到被cancel。`CO_ON_COMPLETE`将在重新启动一个循环程序时被调用。

**请注意，循环程序中的变量不会被重置。**

**请注意**，`RESTART`命令后面不需要有`THEN`命令。任何写在`RESTART`命令后面的东西都不会被执行，就像GML的本地`return`命令。





### 循环

#### `END`

```gml
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

它本身没有任何作用。然而，`END`对于终止`REPEAT`、`WHILE`或`FOREACH`循环是必要的。它也应该被用来终止`RACE`或`SYNC`块。在其他情况下，不能使用它。



#### `REPEAT <expression> THEN <function> END`

```gml
coroutineRootStruct = CO_BEGIN
    REPEAT 5 THEN
        show_debug_message("Five messages!");
    END
CO_END
```

类似于GameMaker自己的`repeat()`循环。没有必要在**所有的情况**下使用这个宏来取代标准的`repeat()`循环。只有当`repeat()`循环包含一个coroutine命令时，才**需要**使用`REPEAT...END`循环。



#### `WHILE <condition> THEN <function> END`

```gml
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



#### `BREAK`

```gml
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



#### `CONTINUE`

```gml
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





### 分支

#### `IF <condition> THEN <function> END_IF` (and `ELSE` and `ELSE_IF`)

```gml
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



### 其他

#### `DELAY <expression> THEN`

```gml
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



#### `AWAIT <condition> THEN`

```gml
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



#### `AWAIT_FIRST <coroutine> ... END`

```gml
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



#### `AWAIT_ALL <coroutine> ... END`

```gml
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



#### `AWAIT_BROADCAST <name> THEN`

```gml
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





### 异步事件

#### `AWAIT_ASYNC_* <function> THEN`

```gml
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



#### `ASYNC_COMPLETE`

```gml
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



#### `AWAIT_ASYNC_* <function> ASYNC_TIMEOUT <duration> THEN`

```gml
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