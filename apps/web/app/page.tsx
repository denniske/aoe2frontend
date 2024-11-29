import {getConfig} from "@/helper/config";

const config = getConfig();

export default function Page() {
    return (
        <div className="flex flex-row">
            <div className="flex-1 p-8 pt-32">
                <h3 style={{ fontFamily: 'Merriweather,sans-serif' }}>
                    Track your games now.
                </h3>

                <br/>
                <div className="flex flex-row space-x-4">
                    <a href={`https://play.google.com/store/apps/details?id=${config.app.android.bundleId}`}>
                        <img src="/app-button-play-store.png" className="max-h-[50px]" />
                    </a>
                    <div className="app-button-spacer"/>
                    <a href={`https://apps.apple.com/app/id${config.app.ios.bundleId}`}>
                        <img src="/app-button-app-store.png" className="max-h-[50px]" />
                    </a>
                </div>

                <br/>
                <br/>
                <p className="text-sm py-3">Also available:</p>
                <a href={`https://app.${config.host}`} target="_blank">
                    <img src="https://img.shields.io/static/v1?label=Web&logo=google-chrome&message=Open&logoColor=FFFFFF&color=brightgreen"/>
                </a>

                <br/>
                <br/>
                <br/>
                <p className="text-sm py-3">Community:</p>
                <a href={`https://github.com/denniske/aoe2companion`} target="_blank">
                    <img src={`https://img.shields.io/badge/github-aoe2companion-brightgreen?label=Github&logo=github`}/>
                </a>
                &nbsp;&nbsp;
                <a href="https://discord.gg/gCunWKx" target="_blank">
                    <img src="https://img.shields.io/discord/727175083977736262.svg?label=Discord&logo=discord&logoColor=ffffff&labelColor=7289DA&color=2c2f33"/>
                </a>
                <div style={{height: '10px'}}/>
                <a href="https://www.buymeacoffee.com/denniskeil" target="_blank">
                    <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshields-io-buymeacoffee.vercel.app%2Fapi%3Fusername%3Ddenniskeil"/>
                </a>
            </div>

            <div className="p-8">
                <picture>
                    <source srcSet={`/web/${config.game}/ios-shot.png`} media="(prefers-color-scheme: light)"/>
                    <source srcSet={`/web/${config.game}/ios-shot-dark.png`} media="(prefers-color-scheme: dark)"/>
                    <img src={`/web/${config.game}/ios-shot.png`} style={{maxWidth: '400px'}}/>
                </picture>
            </div>
        </div>
    );
}
