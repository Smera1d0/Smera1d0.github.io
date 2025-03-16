// 强制修复公式换行问题
document.addEventListener('DOMContentLoaded', function() {
    // 首先确保KaTeX已经加载
    function waitForKatex() {
        if (typeof renderMathInElement === 'undefined') {
            setTimeout(waitForKatex, 100);
            return;
        }
        
        // 正确渲染公式
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false,
            trust: true,
            strict: false,
            macros: {
                "\\newline": "\\\\",
                "\\nl": "\\\\",
                "\\break": "\\\\"
            }
        });
        
        // 延迟执行，确保渲染完成后再处理
        setTimeout(function() {
            // 找到所有公式块
            document.querySelectorAll('.katex-display').forEach(function(el) {
                // 强制启用换行
                const formula = el.textContent;
                
                // 修改公式块样式
                el.style.maxWidth = '100%';
                el.style.overflowX = 'auto';
                el.style.overflowY = 'hidden';
                
                // 修改内部KaTeX容器
                const katexEl = el.querySelector('.katex');
                if (katexEl) {
                    katexEl.style.display = 'block';
                    katexEl.style.maxWidth = '100%';
                    katexEl.style.whiteSpace = 'normal';
                }
                
                // 修改HTML渲染层
                const htmlEl = el.querySelector('.katex-html');
                if (htmlEl) {
                    htmlEl.style.display = 'block';
                    htmlEl.style.maxWidth = '100%';
                    htmlEl.style.whiteSpace = 'normal';
                    
                    // 处理换行
                    htmlEl.querySelectorAll('.mspace.newline').forEach(function(newline) {
                        newline.style.display = 'block';
                        newline.style.height = '1em';
                    });
                }
                
                // 特殊处理aligned环境
                if (formula.includes('aligned') || formula.includes('split') || formula.includes('array')) {
                    const mathmlEl = el.querySelector('.katex-mathml');
                    if (mathmlEl) {
                        mathmlEl.style.display = 'block';
                    }
                }
            });
            
            // 修复加粗文本问题
            document.querySelectorAll('strong').forEach(function(el) {
                el.style.fontWeight = '700';
            });
        }, 500);
    }
    
    // 启动处理
    waitForKatex();
}); 