" vimrc uses " for comments.
" THIS IS A VIMRC File.
"
"
"Changelog
"   - Tried to use commmand S didn't work.
"   - Stay with VIMRC and BASHRC only.
"   - Don't know what leader is for the RenameFile function.
"   - Added font colors with the hi.


"Setting internal Vim Commands
command S source ~/.vimrc

inoremap jk <esc>
inoremap jj <esc>
" inoremap " "" <left>
inoremap ( () <left>
inoremap [ [] <left>
inoremap { {} <left>
" inoremap {<CR> {<CR>} <ESC> O
" inoremap {;<CR> {<CR>}; <ESC> O
iab date: <c-r>=strftime("%B %d, %Y:") <CR>
iab Tra: <c-r>='Organization: ' <CR>
iab orgo: <c-r>='Organization: ' <CR>
iab a: <c-r>='Alias: ' <CR>
set tabstop=2
set expandtab
set shiftwidth=2
set mouse=a

hi markdownH1 guifg=blue ctermfg=blue gui=bold cterm=bold 
hi markdownH2 guifg=red ctermfg=blue gui=bold cterm=bold
hi markdownH3 guifg=green ctermfg=blue gui=bold cterm=bold 
hi markdownH4 guifg=purple ctermfg=blue gui=bold cterm=bold 
hi markdownH5 guifg=blue ctermfg=blue gui=bold cterm=bold 
hi markdownH6 guifg=blue ctermfg=blue gui=bold cterm=bold

function! RenameFile()
    let old_name = expand('%')
    let new_name = input('New file name: ', expand('%'), 'file')
    if new_name != '' && new_name != old_name
        exec ':saveas ' . new_name
        exec ':silent !rm ' . old_name
        redraw!
    endif
endfunction

map <leader>n :call RenameFile()<cr>


