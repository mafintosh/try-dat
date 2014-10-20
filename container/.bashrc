alias ls="ls --color=auto --group-directories-first"
alias ll="ls -l"
alias ..="cd .."

export EDITOR=vim
#export PS1="\033[44m try-dat \033[m\033[42m \W \033[m "
export PS1="[try-dat] \W $ "

if [ "$HOST" != "" ]; then
  printf "\n"
  printf "If you run 'dat listen' you will be able to clone this dat by doing\n"
  printf "\n"
  printf "   dat clone $HOST\n"
  printf "\n"
  printf "When you close this tab your dat will be removed\n"
  printf "\n"
fi