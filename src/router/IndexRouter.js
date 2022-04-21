import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from "../views/login/Login"
import NewsSandBox from "../views/sandBox/NewsSandBox"

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login}></Route>
                <Route path="/" render={() =>
                    <NewsSandBox />
                } />
            </Switch>
        </HashRouter>
    )
}
