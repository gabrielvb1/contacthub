# ContacHub

## COMO CONFIGURAR O AMBIENTE E RODAR A APLICAÇÃO:

- NO DIRETÓRIO RAÍZ DIGITE NO TERMINAL O COMANDO npm install
### OBS: SE O NPM INSTALL PARECER NÃO FINALIZAR, PODE ENCERRAR O PROCESSO E PASSAR PARA O PROXIMO PASSO (NPM START)
- DEPOIS DIGITE O COMANDO npm start. ISSO SERÁ O SUFICIENTE PARA RODAR A APLICAÇÃO FULLSTACK NO MESMO REPOSITÓRIO
- A APLICAÇÃO RODARÁ EM http://localhost:3000/


- O sistema trata-se de uma aplicação para cadastro de clientes e seus respectivos contatos. 
- A aplicação está conectada com a API RESTful criada por mim no diretório back-end dentro desse projeto. A API extrai e persiste dados de um banco de dados SQL que criei utilizando o SQLite (também configurada nesse projeto). 

As funcionalidades da aplicação são: 

- Cadastro do usuário no sistema
- Login de usuário no sistema
(Em /clients):
- Cadastro de um Cliente
- Listagem de Clientes 
- Editar Um Cliente
- Excluir Cliente
- Visualizar Contatos de um Cliente
(Em /contacts):
- Cadastro de um Cliente
- Listagem de Clientes 
- Editar Um Cliente
- Excluir Cliente

## Detalhamento de Requisitos:
### Cadastro de um novo usuário:

Para cadastrar um novo usuário você terá que preencher o formulário na página de **cadastro**.


*Caso todos os campos não estiverem preenchidos ou os valores dos formulários de senha não sejam os mesmos, mensagens de erros correspondentes aparecerão no formulário

Após clicar no botão Cadastrar, o usuário será redirecionado para a página de Login
### Login de usuário:

1. Na página de login de usuário, há um texto que redireciona o usuário para a tela de cadastro caso ele ainda não tenha login na aplicação:
2. O formulário de login valida se os campos estão realmente preenchidos. Se sim, a aplicação permite o login do usuário.
3. Efetuado o login, o usuário é direcionado para a pagina principal **home**.
4. Caso o usuário esteja logado, ele não poderá voltar a página de login. Apenas se ele se deslogar da aplicação em um botão na página home.

---
### Página principal (home):
Nessa página ele poderá escolher se quer ir para a página de Clientes ou de Contatos, clicando em um dos botões respectivos
É possível também navegar pelas páginas através do menu lateral a esquerda

### Página Clientes (/clients):
Na tela de Clientes, há uma tabela exibindo os clientes cadastrados. É possível visualizar o nome, e-mail e telefone de cada cliente. A tela também possui um botão Adicionar Cliente que abre um formulário para cadastrar um novo cliente no sistema.

Além disso, ao lado de cada cliente, há ícones de ação, como o ícone de lápis para editar o cliente e o ícone de lixeira para excluir o cliente. Clicando no ícone de olho, o usuário pode visualizar em detalhes os contatos cadastrados para aquele cliente específico.

### Página Contatos (/contacts):
Na tela de Contatos, é exibida uma tabela semelhante à da tela de clientes, mas com a listagem de contatos. Cada contato pode ser editado ou excluído por meio dos ícones de lápis e lixeira, respectivamente. Há também um botão Adicionar Contato, que permite cadastrar um novo contato vinculado a um cliente específico.



