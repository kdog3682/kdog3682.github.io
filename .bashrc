export editor=VIM
alias docs='cd ~/documents'
alias home='cd ~'
alias root='cd /'
alias dtop='cd ~/Desktop'
alias dbox='cd ~/Dropbox'
alias box='cd ~/Box\ Sync'
alias gdrive='cd ~/Google\ Drive'
alias vim="nvim"
alias vi="nvim"
alias oldvim="vim"
alias bashrc='vim ~/.bashrc'
alias self='vim ~/updates.txt'
alias boo='vim ~/.foo'
alias sourcebash='source ~/.bashrc'
alias vimrc='vim ~/.vimrc'

alias sourcevim='source ~/.vimrc'

function kd() {
  cd ~/documents
  cd kdog3682
}

gitpush() {
    git add .
    git commit -m "gitpush all"
    git push origin master 
}
alias gp=gitpush

dogger() {
  cd ~/documents
  cd kdog3683
}



# NOTES

# Use " for comments in vimrc.
# Use # for comments in bashrc.

# Place everything from bash_profile ans bash_aliases in bashrc.
# Do the same thing for vimrc.

