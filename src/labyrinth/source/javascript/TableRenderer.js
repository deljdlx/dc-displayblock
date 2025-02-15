class TableRenderer
{
  labyrinth = null;

  target = null;
  container = null;

  constructor(labyrinth)
  {
    this.labyrinth = labyrinth;
  }


  render(element) {
    this.target = element;

    this.container = document.createElement('table');
    this.container.classList.add('ariane', 'labyrinth');

    for(let y = 0 ; y < this.labyrinth.getHeight() ; y++) {
      const tr = document.createElement('tr');
      tr.classList.add('ariane', 'row')
      for(let x = 0 ; x < this.labyrinth.getWidth() ; x++) {
        const td = document.createElement('td');
        td.classList.add('ariane', 'cell');
        td.dataset.x = x;
        td.dataset.y = y;
        td.dataset.coord = x+'-'+y;
        td.innerHTML = x+'-'+y;

        const cell = this.labyrinth.cell(x, y);
        if(cell.isPath()) {
          td.classList.add('path');
          for(let css of cell.getCSSClasses()) {
            td.classList.add(css);
          }
        }



        tr.appendChild(td);
      }
      this.container.appendChild(tr);
    }

    this.target.appendChild(this.container);


  }

}