import { Container } from '@/components/ui/Container'
import { SectionHead } from '@/components/ui/SectionHead'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { getFeaturedProjects, getProjectFilters } from '@/sanity/content'

/**
 * Homepage portfolio teaser. Full index lives on `/projects`.
 */
export async function Projects() {
  const [projects, filters] = await Promise.all([getFeaturedProjects(), getProjectFilters()])
  if (projects.length === 0) return null

  return (
    <section id="projects" className="border-t border-line bg-sand/35 py-section">
      <Container>
        <SectionHead
          index="02"
          title="Selected projects"
          standfirst="A measured sample of houses, workplaces and interiors delivered across two decades - design and build under one roof."
        />

        <ProjectGrid
          projects={projects}
          filters={filters}
          className="mt-14 md:mt-16"
          variant="teaser"
          limit={4}
          viewAllHref="/projects"
        />
      </Container>
    </section>
  )
}
