#!/usr/bin/env node
import path from 'path';
import docgen from 'react-docgen-typescript';
import fs from 'fs';
import { findUp } from 'find-up';

/**
 * 获取ts配置
 */
async function getTsConfig(directory) {
  const tsConfigPath = await findUp('tsconfig.json', {
    cwd: directory,
  });
  // 如果没有找到 tsconfig.json 文件，返回一个默认的配置
  if (!tsConfigPath) {
    console.log('tsconfig.json not found, using default configuration');
    return {
      compilerOptions: {
        allowSyntheticDefaultImports: true,
      },
    };
  }
  // 读取并解析 tsconfig.json 文件
  const tsconfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
  // 确保 allowSyntheticDefaultImports 为 true
  tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
  return tsconfig;
}

/**
 * 将json转换为markdown
 */
function jsonToMarkdown([json]) {
  if (!json) {
    return '';
  }
  const description = json.description || json.tags.description;
  const deprecated = json.tags.deprecated;
  const example = json.tags.example;
  const props = json.props;
  const methods = json.methods;
  if (!description && methods.length === 0 && Object.keys(props).length === 0) {
    return '';
  }
  let markdown = `# ${json.displayName}\n\n`;

  markdown += deprecated ? `> **警告:** ${deprecated}\n\n` : '';

  markdown += description ? description + '\n\n' : '';

  if (example) {
    markdown += '## 示例\n\n';
    markdown += '```jsx\n' + example + '\n```\n\n';
  }

  markdown += '## Props\n\n';

  markdown += '| 属性 | 说明 | 类型 | 默认值 |\n';
  markdown += '| ---- | ----------- | ---- | ------- |\n';
  for (const prop in props) {
    if (props.hasOwnProperty(prop)) {
      const val = props[prop];

      markdown += `| ${val.name} | ${val.description} | ${val.type.name.replace(
        /\|/g,
        '\\|'
      )} | ${
        val.defaultValue
          ? String(val.defaultValue.value).replace(/\n/g, ' ')
          : ''
      } |\n`;
    }
  }
  if (methods.length) {
    // api
    markdown += '\n## APIs\n\n';
    for (const prop of json.methods) {
      markdown += '### ' + prop.name + '\n\n';
      markdown += prop.description + '\n\n';
      const params = prop.params;
      if (params.length) {
        markdown += '| 属性 | 说明 | 类型 |\n';
        markdown += '| ---- | ----------- | ---- |\n';
        for (const param of params) {
          markdown += `| ${param.name.replace('?', '')} | ${
            param.description || ''
          } | ${param.type.name} |\n`;
        }
      }
    }
  }

  return markdown;
}

/**
 * 递归处理目录
 */
async function processDirectory(directory, tsConfig) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      try {
        await processDirectory(filePath, tsConfig);
      } catch (err) {
        console.error('Error', err);
      }
    } else if (
      stat.isFile() &&
      (filePath.endsWith('.jsx') || filePath.endsWith('.tsx'))
    ) {
      const componentDocs = docgen
        .withCompilerOptions(tsConfig)
        .parse(filePath);
      const content = jsonToMarkdown(componentDocs);
      if (content) {
        try {
          const target = path.join(directory, 'README.md')
          fs.writeFileSync(target, content);
          console.log(`生成${target}成功`)
        } catch (error) {
        }
      }
    }
  }
}

/**
 * 处理逻辑
 */
async function startProcessing(directory) {
  const tsConfig = await getTsConfig(directory);
  processDirectory(directory, tsConfig);
}

// 获取命令行参数
const args = process.argv.slice(2);

if (args.length !== 1) {
  console.log('缺少目录参数');
} else {
  startProcessing(args[0]);
}
