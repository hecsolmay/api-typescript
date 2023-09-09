import schedule, { type Job } from 'node-schedule'
import Task from '../models/Task'

// Objeto para almacenar las tareas programadas
const scheduledTasks: Record<string, Job> = {}

export async function loadScheduledTasks () {
  try {
    const tasks = await Task.findAll()

    if (tasks.length !== 0) {
      tasks.forEach((task) => {
        const { taskId, fn: fnString, date } = task.dataValues

        /* eslint-disable-next-line */
        const fn = new Function (`return ${fnString}`)()
        scheduledTasks[taskId] = schedule.scheduleJob(date, fn)
      })
    }

    console.log('Tareas programadas cargadas')
  } catch (error) {
    console.error('Error al cargar las tareas programadas')
    console.error(error)
  }
}

loadScheduledTasks()

interface scheduleTaskProps {
  taskId: string
  fn: () => void
  date: Date
}

export function scheduleTask ({ taskId, fn, date }: scheduleTaskProps) {
  scheduledTasks[taskId] = schedule.scheduleJob(date, fn)

  Task.create({ taskId, fn: fn.toString(), date })
    .then(() => {
      console.log(`Tarea programada con ID '${taskId}' creada y guardada en la base de datos`)
    })
    .catch((error) => {
      console.error('Error al crear la tarea programada', error)
    })
}

export function cancelTask (taskId: string) {
  const task = scheduledTasks[taskId]

  if (task != null) {
    task.cancel()

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete scheduledTasks[taskId]
    Task.destroy({ where: { taskId } })
      .then(() => {
        console.log(`Tarea programada con ID '${taskId}' cancelada y eliminada de la base de datos`)
      })
      .catch((error) => {
        console.error('Error al cancelar la tarea programada', error)
      })
  } else {
    console.log(`No se encontró una tarea programada con el ID '${taskId}'`)
  }
}
