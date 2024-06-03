import{_ as e,r as t,o as p,c as o,a,b as n,d as r,e as l}from"./app-R9vh97ZE.js";const c="/assets/ArrayFunctions_Blog_Hero-C8Z02sVe.jpg",i="/assets/array_callback__1_-Bsd7kQTK.jpg",u="/assets/array_map__2_-DoowVywX.jpg",d="/assets/array_find_index-BQssOc0c.jpg",k="/assets/array_filter-CjVaMCyi.jpg",m="/assets/array_reduce__1_-xaUSYEjE.jpg",g={},_=a("p",null,[a("img",{src:c,alt:"如何在GameMaker中使用高级数组函数"})],-1),h={href:"https://gamemaker.io/en/blog/release-2022-11",target:"_blank",rel:"noopener noreferrer"},v=l('<p>其中许多函数利用了“回调方法”，这可能会让人感到困惑。</p><p>因此，让我们来逐步解释吧！</p><h2 id="什么是数组" tabindex="-1"><a class="header-anchor" href="#什么是数组"><span>什么是数组？</span></a></h2><p>如果你对数组不熟悉，<a href="/tool/manual.html?path=GameMaker_Language/GML_Overview/Arrays.htm">这个手册页面</a>应该会给你一个很好的概述。</p><p>许多数组函数使用了“方法”，所以我建议阅读关于<a href="/tool/manual.html?path=GameMaker_Language/GML_Overview/Method_Variables.htm">手册中的方法</a>。</p><h2 id="回调基础" tabindex="-1"><a class="header-anchor" href="#回调基础"><span>回调基础</span></a></h2><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_foreach.htm">array_foreach()</a></strong> 函数是使用回调的最简单的示例。</p><p>你拿一个数组，运行 <strong>array_foreach()</strong>，并给它一个要运行的方法/函数。对于数组中的每个元素，都会运行你的回调方法。</p><p><img src="'+i+`" alt="回调数组"></p><p>“回调方法”只是你自己制作的一个简单方法。</p><p>它基本上是在一本书中翻转每一页，告诉你“这是一页！”，以及关于那一页的信息。</p><h3 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h3><p>让我们在一个包含4个元素（值）的数组上调用 <strong>array_foreach()</strong>。 <strong>array_foreach()</strong> 遍历数组，并为每个元素运行你的回调，如上所示。</p><p><strong>array_foreach()</strong> 还向你的回调提供了两个参数：该元素的<strong>值</strong>和其<strong>索引</strong>（<strong>0</strong>，<strong>1</strong>，<strong>2</strong>，等等...）。</p><p>下面是一个代码示例：</p><div class="language-gml line-numbers-mode" data-ext="gml" data-title="gml"><pre class="language-gml"><code><span class="token keyword">var</span> _array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">33</span><span class="token punctuation">,</span> <span class="token number">44</span><span class="token punctuation">,</span> <span class="token number">55</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token function">array_foreach</span><span class="token punctuation">(</span>_array<span class="token punctuation">,</span> <span class="token function">function</span><span class="token punctuation">(</span>_val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
        <span class="token function">show_debug_message</span><span class="token punctuation">(</span><span class="token string">&quot;{0} at index {1}&quot;</span><span class="token punctuation">,</span> _val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个代码在一个数组上运行 <strong>array_foreach</strong>，将每个元素的值和索引打印到输出日志中：</p><blockquote><p>11 at index 0</p><p>22 at index 1</p><p>33 at index 2</p><p>44 at index 3</p><p>55 at index 4</p></blockquote><p>你可以以更清晰的方式编写相同的代码，先定义方法，然后将其传递给 <strong>array_foreach()</strong> 调用：</p><div class="language-gml line-numbers-mode" data-ext="gml" data-title="gml"><pre class="language-gml"><code><span class="token keyword">var</span> _array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">33</span><span class="token punctuation">,</span> <span class="token number">44</span><span class="token punctuation">,</span> <span class="token number">55</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> _callback <span class="token operator">=</span> <span class="token function">function</span><span class="token punctuation">(</span>_val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
        <span class="token function">show_debug_message</span><span class="token punctuation">(</span><span class="token string">&quot;{0} at index {1}&quot;</span><span class="token punctuation">,</span> _val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">array_foreach</span><span class="token punctuation">(</span>_array<span class="token punctuation">,</span> _callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="array-map" tabindex="-1"><a class="header-anchor" href="#array-map"><span>ARRAY_MAP</span></a></h2><p>让我们再深入一步。</p><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_map.htm">array_map()</a></strong> 的工作方式与前一个函数相同：它接受一个数组和一个回调方法，并在每个数组元素上运行你的回调。</p><p>但这一次，你的回调方法实际上被允许返回一个值。</p><p>这允许你更改数组中的元素。你的回调返回的内容被应用回到同一个元素，但是在数组的一个新副本中。</p><p><img src="`+u+`" alt="Array map"></p><p>在函数结束时，它会给你修改后的数组。原始数组不会改变。</p><p>让我们使用这个函数来将我们的数组中的所有值都加倍：</p><div class="language-gml line-numbers-mode" data-ext="gml" data-title="gml"><pre class="language-gml"><code><span class="token keyword">var</span> _array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">22</span><span class="token punctuation">,</span> <span class="token number">33</span><span class="token punctuation">,</span> <span class="token number">44</span><span class="token punctuation">,</span> <span class="token number">55</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> _callback <span class="token operator">=</span> <span class="token function">function</span><span class="token punctuation">(</span>_val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
        <span class="token keyword">return</span> _val <span class="token operator">*</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">var</span> _new_array <span class="token operator">=</span> <span class="token function">array_map</span><span class="token punctuation">(</span>_array<span class="token punctuation">,</span> _callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">show_debug_message</span><span class="token punctuation">(</span>_new_array<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>数组与之前相同，回调只是返回值乘以2。</p><p>然后我们将其传递给 <strong>array_map()</strong>，它创建一个所有值都加倍的新数组，感谢我们的回调。</p><p>然后将新数组打印到输出日志中，所以你应该会看到这个：</p><blockquote><p>[ 22,44,66,88,110 ]</p></blockquote><h2 id="谓词方法" tabindex="-1"><a class="header-anchor" href="#谓词方法"><span>谓词方法</span></a></h2><p>一些数组函数使用<a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/Array_Functions.htm#h">谓词方法</a>。别担心，它只是一个具有一个特定要求的回调方法。</p><p>如果你的回调方法只能返回<strong>true</strong>或<strong>false</strong>，那么它就是一个谓词方法。</p><p>这样的函数用于告诉一个元素是否符合条件。通过这种技术，你可以对数组执行许多种操作。</p><h2 id="查找索引" tabindex="-1"><a class="header-anchor" href="#查找索引"><span>查找索引</span></a></h2><p>你有一个库存数组，你想知道里面是否有一把剑。你还想知道剑在数组中的确切位置。</p><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_find_index.htm">array_find_index()</a></strong> 正好可以做到这一点。它接受一个谓词方法，当该方法返回<strong>true</strong>时，它会给你返回<strong>true</strong>的元素的索引。</p><p>让我们使用数组：<strong>[“shield”, “sword”, “potion”]</strong>，并运行 <strong>array_find_index()</strong> 来查找 “sword” 元素。这是它的工作原理：</p><p><img src="`+d+`" alt="查找索引"></p><p>这是代码的样子：</p><div class="language-gml line-numbers-mode" data-ext="gml" data-title="gml"><pre class="language-gml"><code><span class="token keyword">var</span> _array <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;shield&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;sword&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;potion&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">var</span> _predicate <span class="token operator">=</span> function <span class="token punctuation">(</span>_val<span class="token punctuation">,</span> _index<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
        <span class="token keyword">return</span> _val <span class="token operator">==</span> <span class="token string">&quot;sword&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">var</span> _sword_id <span class="token operator">=</span> <span class="token function">array_find_index</span><span class="token punctuation">(</span>_array<span class="token punctuation">,</span> _predicate<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">show_debug_message</span><span class="token punctuation">(</span>_sword_id<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在这里，谓词函数在值等于<strong>sword</strong>时返回<strong>true</strong>，否则返回<strong>false</strong>。</p><p>然后我们将其传递给 <strong>array_find_index()</strong>，它给了我们<strong>1</strong>，即找到字符串<strong>sword</strong>的索引。</p><h2 id="all-和-filter" tabindex="-1"><a class="header-anchor" href="#all-和-filter"><span>all 和 filter</span></a></h2><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_all.htm">array_all()</a></strong> 允许你在数组中的所有元素上运行一个谓词方法，并且如果你的谓词对所有元素都返回<strong>true</strong>，它就会返回<strong>true</strong>。</p><p>这可以用来判断数组中的每个元素是否相同，或者是否满足某个条件。</p><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_filter.htm">array_filter()</a></strong> 也使用谓词，并创建一个只包含符合条件的元素的新数组。这样，你可以使用谓词函数作为条件来过滤数组，删除不需要的任何内容。</p><p>假设你有数组：<strong>[5, 11, 15, 6]</strong>，你只想要大于10的值。<strong>array_filter()</strong> 就会为你做到这一点：</p><p><img src="`+k+'" alt="数组过滤"></p><h2 id="reduce" tabindex="-1"><a class="header-anchor" href="#reduce"><span>REDUCE</span></a></h2><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_reduce.htm">array_reduce()</a></strong> 允许你在每个元素上运行一个回调并返回某个值。你为一个元素返回的任何值都将传递到下一个回调中。这样，你可以按顺序处理你的数组。</p><p>最后，你得到了你的回调为最后一个元素返回的任何值。</p><p><img src="'+m+`" alt="数组减少"></p><p>你可以看到回调不会对第一个元素运行。它从第二个元素（<strong>11</strong>）作为当前“值”开始，第一个元素（<strong>5</strong>）作为“前一个”参数传递进去。</p><p>你第一个回调返回的值被传递到下一个回调中作为“前一个”值，然后该回调的返回值被传递到下一个回调中，直到它遍历完所有元素。</p><p>你可以选择指定一个起始值，该值被传递到第一个回调中，如果你这样做了，你的回调也将运行第一个元素。</p><h2 id="更多数组函数" tabindex="-1"><a class="header-anchor" href="#更多数组函数"><span>更多数组函数</span></a></h2><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_create_ext.htm">array_create_ext()</a></strong> 允许你使用回调方法创建一个新数组。这个回调对每个元素运行，并且其返回值被存储在该元素中。</p><p>当你想要生成一个具有一系列值的数组，或者使用一些计算来生成数组元素时，这是非常有用的。</p><div class="language-gml line-numbers-mode" data-ext="gml" data-title="gml"><pre class="language-gml"><code><span class="token keyword">var</span> _array <span class="token operator">=</span> <span class="token function">array_create_ext</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token function">function</span><span class="token punctuation">(</span>_index<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">1</span> <span class="token operator">+</span> _index<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">show_debug_message</span><span class="token punctuation">(</span>_array<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这将创建一个数组，其中每个元素都增加了1，给你这个数组：[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]</p><p>还有一些用不同方式连接数组的函数：</p><ul><li><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_concat.htm">array_concat()</a></strong> 将给定的数组连接成一个数组</p></li><li><p><strong><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_union.htm">array_union()</a></strong> 将给定的数组连接起来，移除重复项</p></li><li><p><a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/array_intersection.htm">array_intersection()</a></p><p>给你存在于所有给定数组中的值</p><ul><li>例如，如果你给它三个数组，数字 <strong>64</strong> 在所有数组中都存在，它将被包含在内</li><li>但是如果数字 <strong>48</strong> 只存在于第一个和第三个数组中，而不在第二个数组中，它将不被包含在内</li></ul></li></ul><p>在手册中查看更多<a href="/tool/manual.html?path=GameMaker_Language/GML_Reference/Variable_Functions/Array_Functions.htm">数组函数</a>。</p><p><strong>祝愉快的游戏开发！</strong></p>`,68);function b(f,y){const s=t("ExternalLinkIcon");return p(),o("div",null,[_,a("p",null,[n("GameMaker有一些"),a("a",h,[n("新函数"),r(s)]),n("，它们提供了更简单、更强大的方法来读取和修改数组。")]),v])}const M=e(g,[["render",b],["__file","advanced-array-functions.html.vue"]]),w=JSON.parse('{"path":"/blogs/2024/6/advanced-array-functions.html","title":"如何在GameMaker中使用高级数组函数","lang":"en-US","frontmatter":{"title":"如何在GameMaker中使用高级数组函数","date":"2023/04/01","categories":["官方教程"]},"headers":[{"level":2,"title":"什么是数组？","slug":"什么是数组","link":"#什么是数组","children":[]},{"level":2,"title":"回调基础","slug":"回调基础","link":"#回调基础","children":[{"level":3,"title":"示例","slug":"示例","link":"#示例","children":[]}]},{"level":2,"title":"ARRAY_MAP","slug":"array-map","link":"#array-map","children":[]},{"level":2,"title":"谓词方法","slug":"谓词方法","link":"#谓词方法","children":[]},{"level":2,"title":"查找索引","slug":"查找索引","link":"#查找索引","children":[]},{"level":2,"title":"all 和 filter","slug":"all-和-filter","link":"#all-和-filter","children":[]},{"level":2,"title":"REDUCE","slug":"reduce","link":"#reduce","children":[]},{"level":2,"title":"更多数组函数","slug":"更多数组函数","link":"#更多数组函数","children":[]}],"git":{"createdTime":1717422587000,"updatedTime":1717422587000,"contributors":[{"name":"Feafly","email":"jjcyf@foxmail.com","commits":1}]},"filePathRelative":"blogs/2024/6/advanced-array-functions.md"}');export{M as comp,w as data};
