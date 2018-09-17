#!/bin/bash

# 1. source this file or append it to your bash/zsh profile.
# 2. modify https_proxy & http_proxy with your own proxy.
# 3. use `proxy on` to turn on proxy and `proxy off` to turn it off.

export PS1_backup=$PS1

function proxy () {
    local prefix
    if [ "$1" = "on" ]; then
        export https_proxy=http://127.0.0.1:1080
        export http_proxy=http://127.0.0.1:1080
        # echo Local HTTP Proxy is enabled.
        prefix="😇"
    else
        unset https_proxy
        unset http_proxy
        # echo Local HTTP Proxy is disabled.
        prefix="😑"
    fi
    export PS1="$prefix $PS1_backup"
}
