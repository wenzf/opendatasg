
import { ContentItemPublic } from "~/types";
import { readableAndIsoTimeByUnixEpoch } from "~/utils/time";
import { Link } from "@remix-run/react";
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    TelegramShareButton,
    WhatsappShareButton,
} from "react-share";

import { NS_CONTENT_CATEGORY, PUBLIC_CONFIG } from "~/config";
import texts from "~/texts";
import EnvelopClosedIconSVG from "~/resources/icons/EnvelopClosedIconSVG";
import FacebookIconSVG from "~/resources/icons/FacebookIconSVG";
import WhatsAppIconSVG from "~/resources/icons/WhatsAppIconSVG";
import TelegramIconSVG from "~/resources/icons/TelegramIconSVG";
import LinkedinIconSVG from "~/resources/icons/LinkedinIconSVG";
import PrintIconSVG from "~/resources/icons/PrintIconSVG";
import { doPrint } from "~/utils/clientOnly/misc.client";
import ContentCategoryLink from "~/components/generics/ContentCategoryLink";
import { ImageHTML } from "~/components/generics/ImageHtml";


/**
 * article view
 */
export default function ContentItem({ contentItem }: {
    contentItem: ContentItemPublic
}) {
    const {
        title, published, body, intro, content_category, image, original_link,
        views_bot, views_human, canonical
    } = contentItem
    const { KT, ST, KT_URL, ST_URL, KT_API_URL, ST_API_URL } = texts.labels.source
    const { STME, STPO, KTME, KTVE } = NS_CONTENT_CATEGORY
    const { readable, iso } = readableAndIsoTimeByUnixEpoch(published)

    const { DOMAIN_NAME } = PUBLIC_CONFIG
    const url = DOMAIN_NAME + canonical


    let contentSource = ''
    let contentSourceURL = ''
    let contentSourceAPIURL = ''
    if (content_category === KTME || content_category === KTVE) {
        contentSource = KT
        contentSourceURL = KT_URL
        contentSourceAPIURL = KT_API_URL
    } else if (content_category === STME || content_category === STPO) {
        contentSource = ST
        contentSourceURL = ST_URL
        contentSourceAPIURL = ST_API_URL
    }

    return (
        <main className="main_frame" itemScope itemType="https://schema.org/NewsArticle">
            <div className="page_article">
                <ContentCategoryLink contentCategory={content_category} />
                <time itemProp="datePublished" content={iso} dateTime={iso} className="date sp">
                    {readable}
                </time>

                <div className="printer_frame">
                    <div className="printer_inner">

                        <button className='btn2' type='button' onClick={() => doPrint()}>
                            <PrintIconSVG width={24} height={24} aria-label="Drucken" />
                        </button>

                    </div>
                </div>

                <meta itemProp="dateModified" content={iso} />
                <meta itemProp="isAccessibleForFree" content="TRUE" />
                <h1 className="sp" itemProp="headline">{title}</h1>
                <ImageHTML position={0} image={image} use_case="article" />
                <p className="lead sp">{intro}</p>
                <div className="page_content sp" dangerouslySetInnerHTML={{ __html: body }} />
                <div className="article_footer">
                    <div className="article_source_block">
                        Quellen:
                        <ul>
                            <li>
                                <Link itemProp="sameAs" to={original_link}>Medienmitteilung</Link>
                            </li>
                            <li>
                                <span itemProp="author" itemScope itemType="https://schema.org/Organization">
                                    <Link itemProp="url" to={contentSourceURL}>
                                        <span itemProp="name">{contentSource}</span>
                                    </Link>
                                </span>
                            </li>

                            {content_category === STPO ? (
                                <li>
                                    <Link to="https://www.stadt.sg.ch/home/verwaltung-politik/direktionen/soziales-sicherheit/stadtpolizei.html">
                                        Stadtpolizei
                                    </Link>
                                </li>
                            ) : null}
                            <li>
                                <Link to={contentSourceAPIURL}>
                                    Open Data API
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="counter_block" itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
                        Ansichten:
                        <link itemProp="interactionType" href="https://schema.org/WatchAction" />
                        <table >
                            <tbody>
                                <tr>
                                    <td>Menschen:</td>
                                    <td itemProp="userInteractionCount">{views_human}</td>
                                </tr>
                                <tr>
                                    <td>Maschinen:</td>
                                    <td>{views_bot}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="shares">
                    <EmailShareButton resetButtonStyle={false} url={url} className="btn2" title={title}>
                        <EnvelopClosedIconSVG width={32} height={32} aria-label="Email" />
                    </EmailShareButton>
                    <FacebookShareButton resetButtonStyle={false} url={url} className="btn2" title={title}>
                        <FacebookIconSVG width={32} height={32} aria-label="Facebook" />
                    </FacebookShareButton>
                    <WhatsappShareButton resetButtonStyle={false} url={url} className="btn2" title={title}>
                        <WhatsAppIconSVG width={32} height={32} aria-label="WhatsApp" />
                    </WhatsappShareButton>
                    <TelegramShareButton resetButtonStyle={false} url={url} className="btn2" title={title}>
                        <TelegramIconSVG width={32} height={32} aria-label="Telegram" />
                    </TelegramShareButton>
                    <LinkedinShareButton resetButtonStyle={false} url={url} className="btn2" title={title}>
                        <LinkedinIconSVG width={32} height={32} aria-label="LinkedIn" />
                    </LinkedinShareButton>
                </div>
            </div>
        </main>
    )
}