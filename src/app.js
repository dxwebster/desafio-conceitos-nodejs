const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//  Lista todos os repositórios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//  Criação de repositório
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body; // recebe do corpo da requisição o title, url e techs

  const repository = { // objeto do novo projeto
    id:uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository); // armazena o novo projeto no repositorio
  return response.json(repository); // retorna o objeto novo criado  em json

});

// Atualização de repositorio
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params; // importa o id vindo no parametro da rota
  const {title, url, techs} = request.body; // importa as informações do body

  const repositoryIndex = repositories.findIndex(repository => repository.id == id); //pesquisa nos repositorios qual a posição do id que to recebendo

  if (repositoryIndex < 0){ // se não encontrar, ou seja, o índice for abaixo de zero
    return response.status(400).send({error: 'Repository not found'}) // retorna com status 400
  }

  // se encontrar, crio as atualizações do repositório, com as informações vinda do corpo
  const repository = { 
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryIndex].likes, // no array repositorios eu procuro a mesma posição do respositório com id indicado, e recebo a quantidade de likes
  };
   
    repositories[repositoryIndex] = repository;  // no array repositorios eu procuro a mesma posição do respositório com id indicado e atribuo as modificações    
    return response.json(repository);// retorno o projeto atualizado

});

// deleta um repositorio
app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params; // importa o id vindo no parametro da rota
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);//pesquisa nos repositorios qual a posição do id que to recebendo

  if (repositoryIndex < 0){ // se não encontrar, ou seja, o índice for abaixo de zero
      return response.status(400).json({error: 'Repository not found'}) // retorna com status 400
  }

  repositories.splice(repositoryIndex, 1); // caso encontre, remova a informação do índice repositoryIndex
  return response.status(204).send(); // retorna em branco, geralmente envia com o status 204
});


// Permite dar like em um repositório
app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params; // importa o id vindo no parametro da rota
  const repository = repositories.find(repository => repository.id == id); //pesquisa nos repositorios se existe algum com o id que to recebendo

 // Se não existir o repositorio, retorna status 400
  if(!repository){
   return response.status(400).send();
 }
 
  repository.likes += 1; // soma mais 1 no repositorio encontrado
  return response.json(repository); // retorna o repositorio que recebeu o like

});

module.exports = app;
