<script>
    const urlList = [ // 手册列表
        "https://manual-static.gm-cn.top/",
        "https://manual-plugged.gm-cn.top/",
        "https://manual.gamemaker.io/beta/en/",
        "https://manual.gamemaker.io/monthly/en/",
    ];
    async function checkAndRedirect(urlList) {
        for(const url of urlList){
            try {
                const response = await fetch(url, { mode: 'no-cors' });
                const searchParams = new URLSearchParams(window.location.search);
                if (response.type === 'opaque') {
                    if(searchParams.get('path') == null){
                        window.location.href = url;
                    }else{
                        window.location.href = url + searchParams.get('path');
                    }
                    sleep(1000);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
    checkAndRedirect(urlList);
</script>

请稍作等待，正在重定向到手册。