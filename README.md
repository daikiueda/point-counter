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

Any strings(default: YYYY-MM-DD-_random srt_)

Set by location.hash;

### Event Action: Game

Timestamp and Generated Code, like `2016-06-26T17:50:43.420Z--01YH9F6R`

### Event Label: Activity

Formatted by types.

#### Start

`start`,_`timestamp`_

#### Name entory

`name`,_`timestamp`_,_`player number`_,_`player name`_

#### Point

`point`,_`timestamp`_,_`player number`_,_`point`_ [, _`player name`_]

#### Modify point

`modify`,_`timestamp`_,_`player number`_,_`point`_ [, _`player name`_]

#### Winner

`winner`,_`timestamp`_,_`player number`_,_`player name`_

