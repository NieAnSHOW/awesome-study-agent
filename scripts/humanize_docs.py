#!/usr/bin/env python3
"""
LLM 文档去AI味处理脚本
批量处理 Markdown 文档,去除 AI 写作痕迹
"""

import re
from pathlib import Path

def remove_ai_flavor(text):
    """去除文本中的 AI 写作痕迹"""

    # AI 词汇替换
    replacements = [
        # 过度强调意义
        (r'深入探讨', '讨论'),
        (r'深入理解', '理解'),
        (r'凸显|强调|彰显', '显示'),
        (r'至关重要的|关键的|核心的', ''),
        (r'发挥着.*?作用', ''),
        (r'是.*?的体现|是.*?的证明', ''),

        # 填充词
        (r'此外', ''),
        (r'值得注意的是', ''),
        (r'需要指出的是', ''),
        (r'我们应该', ''),

        # 模糊归因
        (r'专家认为|观察者指出', '研究发现'),
        (r'行业报告显示', '根据'),
    ]

    # 应用替换
    for pattern, replacement in replacements:
        text = re.sub(pattern, replacement, text)

    # 删除过度使用的修饰词
    text = re.sub(r'强大的\s+', '', text)
    text = re.sub(r'丰富的\s+', '', text)

    return text

def process_file(file_path):
    """处理单个文件"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 应用去AI味处理
    processed_content = remove_ai_flavor(content)

    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(processed_content)

    print(f'已处理: {file_path}')

def main():
    """主函数"""
    base_dir = Path('/Users/niean/Documents/project/awesome-study-agent/config/basics/02-llm-fundamentals')

    # 要处理的文件列表
    files = [
        '01-what-is-llm.md',
        '02-how-llm-works.md',
        '03-major-models.md',
        '04-model-capabilities.md',
        '05-limits-and-challenges.md',
    ]

    for file_name in files:
        file_path = base_dir / file_name
        if file_path.exists():
            process_file(file_path)
        else:
            print(f'文件不存在: {file_path}')

if __name__ == '__main__':
    main()
