---
title: My 2020 Dev Setup
date: '2020-05-14'
type: 'blog-post'
---

I have recently setup up a new dev machine. I thought it would be a good idea to make some notes of what I install and configure for future me.

**This is my setup in 2020 on a MacBook Pro running macOS Catalina 10.15.4.**

## Essentials

**Brave Browser:** https://brave.com/

**iTerm2:** Terminal replacement. https://iterm2.com/.  
I can sync my iTerm settings between different machines via a file in a Dropbox folder.

**Homebrew:** https://brew.sh/

**zsh:** https://www.zsh.org/. `brew install zsh`

**oh-my-zsh**: https://ohmyz.sh/#install

Adding the following to **~/.zshrc**:
```bash
alias gfomm="git fetch origin master:master"
alias gco="git checkout"
alias gtree='git log --graph --full-history --all --pretty=format:"%h%x09%d%x20%s"'

# Set Spaceship ZSH as a prompt (https://github.com/denysdovhan/spaceship-prompt)
SPACESHIP_GIT_SYMBOL="🌈" 
autoload -U promptinit; promptinit
prompt spaceship
```

I use [spaceship-prompt](https://github.com/denysdovhan/spaceship-prompt) to customise my terminal's prompt with git branch, package version and node version, like this:

![spaceshipprompt](./spaceship-prompt.png)

## Productivity:

**Alfred 4 for Mac:** https://www.alfredapp.com/

**Rectangle:** "Move and resize windows in macOS using keyboard shortcuts or snap areas", https://rectangleapp.com/, `brew cask install rectangle`

## Development

**NodeJS:** Install via **nvm**

**nvm:** https://github.com/nvm-sh/nvm#installing-and-updating

**yarn:** https://classic.yarnpkg.com/en/docs/install/#mac-stable (`brew install yarn`)

**Visual Studio Code:** https://code.visualstudio.com/. Notable Extensions:
- [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)
- [Quokka](https://quokkajs.com/): "Rapid JavaScript prototyping in your editor."
- [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer)
- [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)
- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
