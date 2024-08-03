import sanitizeHtml from 'sanitize-html';
import { parseHTML } from 'linkedom';
import { PrettyMarkupModificationRule } from '~/types';
import { APIResult } from '~/types/mediaAPI';


/**
 * destructure content for internal data structure (helper)
 */
export function extractAndModifyTextContent(
    html: APIResult["description"],
    modificationRules: PrettyMarkupModificationRule[]
): {
    modifiedHTML: APIResult["description"]
    extractedText: string
    extractedAlt?: string
} {
    const { document } = parseHTML(html);
    let extractedText = ''
    let extractedAlt

    for (const rule of modificationRules) {
        const elements = document.querySelectorAll(rule.selector);
        const depth = rule.selector.split('>').length

        for (const element of elements) {
            if (rule.replacement === 'remove') {
                if (rule.extractText && element.textContent) extractedText = element.textContent
                if (rule.extractAlt && typeof element.getAttribute('alt') === 'string') extractedAlt = element.getAttribute('alt') ?? ''
                if (depth === 1) {
                    element.parentNode?.removeChild(element)
                } else if (depth === 2) {
                    element.parentNode?.parentNode?.removeChild(element.parentNode)
                } else if (depth === 3) {
                    element.parentNode?.parentNode?.parentNode?.removeChild(element.parentNode.parentNode)
                }
            } else {
                /**
                 * element.parentNode?.textContent === element.textContent
                 * 
                 * only match structures such as <p><b>title</b></p> ... avoid matching <p>Some text <b>bold</b> more text</p> 
                 */
                if (!rule?.maxLenReplaceText || (element.textContent?.length && (rule.maxLenReplaceText > element.textContent?.length && element.parentNode?.textContent === element.textContent))) {
                    if (depth === 1) {
                        element.outerHTML = `<${rule.replacement}>${element.textContent}</${rule.replacement}>`
                    } else if (depth === 2) {
                        if (element.parentElement) element.parentElement.outerHTML = `<${rule.replacement}>${element.textContent}</${rule.replacement}>`
                    }
                }
            }
        }
    }
    const getInnerDirty = document.querySelectorAll('.t')[0].innerHTML.toString().trim()
    const clean = sanitizeHtml(getInnerDirty)
    return { modifiedHTML: clean, extractedAlt, extractedText };
}


export function removeNewlinesAndTabsLoop(str: string): string {
    let result = "";
    for (let i = 0; i < str.length; i += 1) {
        if (str[i] !== "\n" && str[i] !== "\t") {
            result += str[i];
        }
    }
    return result;
}

