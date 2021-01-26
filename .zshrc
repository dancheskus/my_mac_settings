# ------------------------------------------ MY CONFIG ----------------------------------------------------
plugins=(git alias-tips zsh-autosuggestions)

source $ZSH/oh-my-zsh.sh

# Remove "%" sign from oh my zsh on terminal startup
unsetopt PROMPT_SP

alias cls='clear'

# git
alias gi='git init'
alias gc='git clone'
alias gsc='git stash clear'
alias grbF='git branch | grep -v "master" | xargs git branch -D' # force remove all branches except master
alias grmlcom='git reset --hard HEAD~1' # remove last local commit

# npm
alias n='npm'
alias ni='npm init -y'

# yarn
alias y='yarn'
alias yi='yarn init -y'
alias ya='yarn add'
alias yad='yarn add --dev'
alias yag='yarn global add'
alias yr='yarn remove'
alias yrg='yarn global remove'
alias ys='yarn start'
alias yt='yarn test'
alias yrun='yarn run'
alias ycra='yarn create react-app'
alias ycrat='yarn create react-app $1 --template typescript'

# docker
alias dc='docker-compose'
alias dcu='dc up'
alias dcd='dc down'
alias dcex='dc exec $1'
function dcsh() {dc exec $1 /bin/sh}
function dconf() {dc -f docker-compose.yml -f $1 up $2}

# common
alias desk='cd ~/Desktop/'
alias .='cd ..'
alias ..='cd ../..'
alias ...='cd ../../..'
alias md='mkdir'
alias b='cd backend'
alias f='cd frontend'
