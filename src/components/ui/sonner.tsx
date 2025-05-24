import { useTheme } from 'next-themes';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        duration: 3000,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-vison-peach/75 backdrop-blur-md group-[.toaster]:text-vison-dark-charcoal group-[.toaster]:border-vison-peach border-2 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-vison-dark-charcoal',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { toast, Toaster };
