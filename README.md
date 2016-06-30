# point-counter
Point counter

## for Developer

```Bash
$ git clone https://github.com/daikiueda/point-counter.git
$ cd ./point-counter/assets
$ npm install
$ npm start
```

## Google Analytics Events

### Event Category: Event

Any strings(default: YYYY-MM-DD--_random srt_)

Set by location.hash;

### Event Action: Game

Timestamp and Generated Code, like `2016-06-26T17:50:43.420Z--01YH9F6R`

### Event Label: Activity

Formatted by types.

#### Start

_`timestamp`_,`start`

#### Name entory

_`timestamp`_,`name`,_`playerIndex`_,_`playerName`_

#### Point

_`timestamp`_,`point`,_`playerIndex`_,_`point`_ [, _`playerName`_]

#### Modify point

_`timestamp`_,`modify`,_`playerIndex`_,_`point`_ [, _`playerName`_]

#### Winner

_`timestamp`_,`winner`,_`playerIndex`_ [,_`playerName`_]

