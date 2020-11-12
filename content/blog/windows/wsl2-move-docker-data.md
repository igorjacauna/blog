---
title: WSL2 - Movendo docker-desktop-data para outro lugar
date: 2020-11-12
type: post
blog: true
excerpt: O Windows 10 vem com WSL2 tornando possível usar o Docker integrado às distribuições Linux que rodam no Windows 10. Aqui vamos mostrar como colocar os arquivos em outro lugar uma vez que não é possível apenas mudando as configurações no Docker.
tags: 
    - docker-windows
    - wsl2
---

O Windows 10 vem com WSL2, tornando possível usar o Docker integrado às distribuições Linux que rodam no Windows 10. Aqui vamos mostrar como colocar os arquivos em outro lugar uma vez que não é possível apenas mudando as configurações no Docker.

Eu costumo usar uma máquina equipada com SSD e um HD. Como uso bastante docker, as imagens podem ocupar um espaço considerável no SSD. Então uma alternativa seria configurar o Docker para salvar as imagens em outro lugar. Mas com Docker usando WSL2 não funciona mudar as configurações do Docker, é necessário mover a distro usada pelo Docker no WSL2.

O Docker para Windows quando usado com WSL2 salva um arquivo `*.vhdx`, onde ficam os dados usados pelo Docker, no caminho `%LOCALAPPDATA%\Docker\wsl\data`. O que de certa forma é uma distro usada pelo Docker para subir os containers.

Se você rodar:

`wsl --list -v`

Vai listar as distros que o WSL tem na sua máquina:

```
NAME                   STATE           VERSION
* Ubuntu                 Running         2
  docker-desktop         Running         2
  docker-desktop-data    Running         2
```

Podemos observar que existe a `docker-desktop-data`. É aqui que o Docker salva as imagens, volumes nomeados, etc.

Então, não basta inserir nas configurações do Docker um `data-root` e dizer para qual diretório salvar. Se fizer isso, o Docker não vai funcionar. **Lembrando que isso se aplica apenas quando usado com WSL2**

Então, é necessário fazer um trabalho com o WSL. Vamos exportar para um arquivo `.tar` a distro utilizada pelo Docker e depois importar para outro diretório.

1. Primeiro, vamos parar o serviço do Docker
2. Vamos parar todas as distros WSL em execução com o comando `wsl --shutdown`
3. Agora para exportar a distro: `wsl --export docker-desktop-data "docker-desktop-data.tar"`
4. Depois de exportar, desativamos a distro: `wsl --unregister docker-desktop-data`
5. Criamos o diretório onde vai ficar, no meu caso é `D:\wsldata\docker-desktop-data`
6. Agora só importar para um novo diretório: `wsl --import docker-desktop-data "D:\wsldata\docker-desktop-data" "docker-desktop-data.tar" --version 2`
7. Depois de importar você pode excluir o arquivo `docker-desktop-data.tar`

No passo **`6`** é importante o parâmetro `--version 2` pois indica sobre qual versão estamos importando a distro e como é pra usar com Docker tem que ser a versão 2 ou seja wsl2

Pronto, agora você pode reiniciar o serviço do Docker e vai estar tudo ok. As imagens, volumes nomeados, etc. vão estar no novo diretório, poupando espaço no SSD.


#### Obs:
Se você quiser fazer isso para outras distros que não necessáriamente do Docker, é bom atentar que esse processo de importação acaba definindo o usuário padrão como root, pra resolver isso basta editar o arquivo `/etc/wsl.conf` e incluir:

```ini
[user]
default=<username>
```

Óbvio que não esquecendo de substituir `<username>` pelo nome do usuário desejado que seja o padrão da distro.


Isso é tudo.

---
_Referências:_
- https://github.com/docker/for-win/issues/5829#issuecomment-622442186
- https://github.com/microsoft/WSL/issues/4276#issuecomment-553367389
