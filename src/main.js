import { h, render, Component } from 'preact'
import { Ticker, Trace } from 'rim'
import { Resource } from 'rim/federation'
import { Store, Provider } from 'rim/preact-redux'
import XmlPlay from './xmlplay'
import './index.scss'

window.main = _ =>
{
    Trace('sheet-music')
    const ticker = new Ticker()
    ticker.start()
    Resource.Init(evt => render(
        <Provider store={new Store({ ticker })}>
            <XmlPlay />
        </Provider>
    , document.body))
}
